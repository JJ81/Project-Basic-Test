var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysql_dbc = require('../../commons/db_conn')();
var connection = mysql_dbc.init();

var bcrypt = require('bcrypt');
var async = require('async');
var QUERY = require('../../database/query');

var TWOACEAPI = require('../../secret/_bak/twoace_api')('dev');
var util = require('../../util/util');
var CommonDAO = require('../../RedisDAO/RedisDAO');
var UTIL = require('../../util/util');

/**
 * create agent
 */
router.post('/agent/create', function (req, res) {
  var _data = {
    code: req.body.create_agent_code,
    password: req.body.pass,
    parent_id: req.body.parent_agent,
    layer: Number(req.body.layer) + 1, // todo 선택된 parent_id + 1을 하는 코드로 변경을 해야 한다
    acc: req.body.creditCap || 0
  };


  console.log('@@@@ Created Layer Number @@@@@@@ : ' + _data.layer);

  var REDIS_KEY = 'AMS:COMMON:' + req.user.agent + ':AGENTLIST';
  _data.password = bcrypt.hashSync(_data.password, 10);

  async.series([
    function (callback) {
      connection.query(QUERY.AGENT.create, _data, function (err, data) {
        callback(err, data);
      })
    },
    function (callback) {
      CommonDAO.DeleteByKeyName(req.cache, REDIS_KEY, function (err, result) {
        console.info('Delete ' + REDIS_KEY + ' \'s data');
        callback(err, result)
      });
    }
  ], function (err, result) {
    if (err) {
      console.error(err);
      res.json({success: false, msg: 'Somthing went wrong, please try again later.'});
    } else {
      res.json({success: true, msg: 'Created Agent successfully!'});
    }
  });
});


/**
 * Check if the agent code is duplicated or not.
 */
router.post('/agent/duplicated', function (req, res) {
  var stmt = 'select `code` from `agent` where `code`=?;';
  console.log(stmt);
  connection.query(stmt, [req.body.create_agent_code], function (err, data) {
    if (err) {
      console.error(err);
      res.json({
        success: false
      });
    } else {
      // console.log(data.length);

      if (data.length === 0) {

        res.json({
          success: true,
          duplicated: false,
          msg: 'This code is available '
        });
      } else {

        res.json({
          success: true,
          duplicated: true,
          msg: 'This code is already in use.'
        });
      }
    }
  });
});

router.post('/agent/set/password', function (req, res) {
  var password = req.body.pass;
  var re_password = req.body.re_pass;
  var code = req.body.code;


  if (password != re_password) {
    /*TODO 일치하지 않을 경우 처리*/
  }
  var hash = bcrypt.hashSync(password, 10);

  connection.query(QUERY.AGENT.changePassword, [hash, code], function (err, result) {
    if (err) {
      res.json({
        success: false
      })
    } else {
      res.json({
        success: true,
        msg: 'Password change Success'
      })
    }
  });
});

const AgentService = require('../../service/_bak/AgentService');

/**
 * 에이전트가 자신의 에이전트에게 전달
 */
router.post('/agent/credit/to', function (req, res, next) {

  if(!util.objEmptyCheck(req.body)){
    console.error('Empty body was received in server');
    throw new Error('Credit Agent insufficient data');
  }

  const _amount = util.removeFrontZeroNumber(util.removeCommasFromNumber(req.body.amount));

  if(isNaN(_amount)){
    console.error('inproper data was received in amount field.');
    throw new Error('Credit Agent inproper data');
  }

  // Parent Agent cannot give himself.
  if (req.body.target === req.user.agent) {
    console.error('Agent can not give chip themselves.');
    throw new Error('Credit Agent inproper data');
  }

  const _creditInfo = {
    my : req.user.agent,
    target: req.body.target.trim(),
    amount : util.removeFrontZeroNumber(util.removeCommasFromNumber(req.body.amount))
  };

  console.info(_creditInfo);


  connection.beginTransaction(function (err) {
    if(err){
      console.error(err);
      throw new Error(err);
    }


    async.series(
      [
        // 일단 parent Agent의 balance를 가져와서 입력하려는 amount값과 비교한다.
        function (callback) {
          connection.query(QUERY.AGENT.GetAgentBalance, [_creditInfo.my], function (err, rows) {
            if(err){
              console.error(err);
              callback(err, null);
            }else{
              if(rows.balance < _creditInfo.amount){
                console.error('Parent Agent can not give amount greater than he has.');
                callback(err, null);
              }else{
                callback(null, rows);
              }
            }
          });
        },

        function (callback) {
          // amount만큼 parent Agent의 balance를 차감하고
          connection.query(QUERY.AGENT.UPDATE_AMOUNT_DEBIT, [_creditInfo.amount, _creditInfo.my], function (err, result) {
            if(err){
              console.error(err);
              callback(err, null);
            }else{
              callback(null, result);
            }
          });
        },

        function (callback) {
          // amount만큼 child agent에게 가감해준다.
          connection.query(QUERY.AGENT.UPDATE_AMOUNT_CREDIT, [_creditInfo.amount, _creditInfo.target], function (err, result) {
            if(err){
              console.error(err);
              callback(err, null);
            }else{
              callback(null, result);
            }
          });
        },

        function (callback){
          // todo Agent수치와 관련된 키를 레디스에서 모두 지운다
          // todo parant agent의 모든 데이터와 child agent의 모든 데이터를 지워야 한다.

          var KEY_PATTERN = 'AMS:*[' + _creditInfo.my + ']:*';
          CommonDAO.DeleteByKeyPattern(req.cache, KEY_PATTERN, function (err, result) {
            if(err){
              console.error(err);
            }else{
              console.info('Delete ' + KEY_PATTERN + ' \'s data');
              callback(null, result);
            }
          });
        }
      ],

      function(err, result){
        if(err){
          console.error(err);
          connection.rollback();
          // todo error페이지를 호출할 수 있도록 처리한다.
          throw new Error(err);
        }else{
          //console.log('result');
          //console.info(result);
          connection.commit();

          // todo parent agent의 밸런스에서 amount를 제하고 남은 값을 리턴 받을 수 있도록 한다.

          AgentService.GetAgentBalance(connection, req.user.agent, function (err, result) {
            if(err){
              console.error(err);
            }else{
              // console.log(result);
              req.user.balance = result[0].balance;
            }
            res.redirect('/agents');
          });
          //res.json({
          //  success: true,
          //  msg: 'Credit Successfully'
          //});
        }
    });
  });



  //// todo 앞 뒤 빈칸을 모두 제거한다. (값을 할당하는 부분)
  //var _creditLogInfo = {
  //  agent_id: req.user.agent,
  //  date: new Date(),
  //  type: 'A2A',
  //  amount: _creditInfo.amount,
  //  balance: null,
  //  target_agent_id: _creditInfo.target,
  //  target_player_id: null,
  //  memo: req.body.memo
  //};

  //var _date = {
  //  startDate: UTIL.GetCurrentDateTime('.'),
  //  endDate: UTIL.GetCurrentDateTime('.')
  //};


  // todo 입력 당시 칩을 주는 에이전트의 밸런스를 가져와야 한다.
  // todo req.user.balance를 갱신해야 한다.
  // todo 레디스에 위의 절차와 관련된 키를 모두 지워야 한다






  /* series 순서
   * 1. Credit Amount 만큼 자신의 balance에서 차감
   * 2. 해당 Agent 에게 Credit Amount 만큼 더함
   * 3. 현재 자신의 Balance를 가져옴
   * 4. WALLET LOG에 현자 자신의 balance 및 기타기록저장
   * 5. Agent List Redis Key delete
   * 6. HOME Redis Key delete (오늘 날짜만)
   * */

  //connection.beginTransaction(function (err) {
  //  // todo 1. 칩을 줄 에이전트의 밸런스를 가져온다
  //
  //  // todo 2. 입력한 칩의 값과 현재 밸런스를 비교한다 비교한 후에 입력한 값이 더 클 경우 에러를 처리한다.
  //  // 이 때 바로 async를 바로 정지시킬 수 있는가?
  //
  //  // todo 3. 그렇지 않을 경우
  //
  //  // todo 3-1. 입력한 칩의 양만큼 칩을 주는 에이전트의 밸런스를 조정하고
  //
  //  // todo 3-2. 입력한 칩의 양만큼 칩을 받을 에이전트의 밸런스를 조정한다.
  //
  //
  //
  //
  //  //async.series([
  //  //    function (callback) {
  //  //      connection.query(QUERY.AGENT.UPDATE_AMOUNT_DEBIT, [_creditInfo.amount, _creditLogInfo.agent_id], function (err, result) {
  //  //        callback(err, result);
  //  //      })
  //  //    },
  //  //    function (callback) {
  //  //      connection.query(QUERY.AGENT.UPDATE_AMOUNT_CREDIT, [_creditInfo.amount, _creditInfo.target], function (err, result) {
  //  //        callback(err, result);
  //  //      })
  //  //    },
  //  //    function (callback) {
  //  //      connection.query(QUERY.AGENT.READ_CURRENT_BALANCE, [_creditLogInfo.agent_id], function (err, result) {
  //  //        _creditLogInfo.balance = result[0].balance;
  //  //        callback(err, result);
  //  //      })
  //  //    },
  //  //    function (callback) {
  //  //      connection.query(QUERY.HOME.LOG_WALLET, _creditLogInfo, function (err, result) {
  //  //        callback(err, result)
  //  //      })
  //  //    },
  //  //    function (callback) {
  //  //      CommonDAO.DeleteByKeyPattern(req.cache, KEY_PATTERN, function (err, result) {
  //  //        console.info('Delete ' + KEY_PATTERN + ' \'s data');
  //  //        callback(err, result)
  //  //      })
  //  //    }
  //  //  ], function (err, results) {
  //  //    if (err) {
  //  //      connection.rollback();
  //  //      console.log(err);
  //  //      err.coee = 500;
  //  //    } else {
  //  //      connection.commit();
  //  //
  //  //      req.user.balance = _creditLogInfo.balance;
  //  //      res.json({
  //  //        success: true,
  //  //        msg: 'Credit Success'
  //  //      })
  //  //    }
  //  //  }
  //  //)
  //
  //});
});


router.post('/agent/debit/to', function (req, res, next) {
  var bodyEmptyCheck = util.objEmptyCheck(req.body);

  if (!bodyEmptyCheck) {
    console.log('body is empty');
    return false;
  }

  var _debitInfo = {
    target: req.body.target,
    amount: Number(req.body.amount)
  };

  /*나 자신에게 Credit시 오류, sun_balance가 0보다 작으면오류*/
  if (_debitInfo.target == req.user.agent || req.body.sum_balance < 0) {
    console.log('self credit err');
    return false;
  }


  var _debitLogInfo = {
    agent_id: req.user.agent,
    date: new Date(),
    type: 'A2A',
    // amount: Number(req.body.amount),
    amount: -(_debitInfo.amount),
    balance: null,
    target_agent_id: _debitInfo.target,
    target_player_id: null,
    memo: req.body.memo
  };

  var KEY_PATTERN = 'AMS:*[' + _debitLogInfo.agent_id + ']:*';


  /* series 순서
   * 1. Debit Amount 만큼 자신의 balance에서 더함
   * 2. 해당 Agent 에게 Debit Amount 만큼 차감
   * 3. 현재 자신의 Balance를 가져옴
   * 4. WALLET LOG에 현자 자신의 balance 및 기타기록저장
   * 5. Agent List Redis Key delete
   * 6. HOME Redis Key delete (오늘 날짜만)
   * */

  connection.beginTransaction(function (err) {
    async.series([
        function (callback) {
          connection.query(QUERY.AGENT.UPDATE_AMOUNT_CREDIT, [_debitInfo.amount, _debitLogInfo.agent_id], function (err, result) {
            callback(err, result);
          })
        },
        function (callback) {
          connection.query(QUERY.AGENT.UPDATE_AMOUNT_DEBIT, [_debitInfo.amount, _debitInfo.target], function (err, result) {
            callback(err, result);
          })
        },
        function (callback) {
          connection.query(QUERY.AGENT.READ_CURRENT_BALANCE, [_debitLogInfo.agent_id], function (err, result) {
            _debitLogInfo.balance = result[0].balance;
            callback(err, result);
          })
        },
        function (callback) {
          connection.query(QUERY.HOME.LOG_WALLET, _debitLogInfo, function (err, result) {
            callback(err, result)
          })
        },
        function (callback) {
          CommonDAO.DeleteByKeyPattern(req.cache, KEY_PATTERN, function (err, result) {
            console.info('Delete ' + KEY_PATTERN + ' \'s data');
            callback(err, result)
          })
        }
      ], function (err, results) {
        if (err) {
          connection.rollback();
          console.log(err);
          err.coee = 500;
        } else {
          connection.commit();
          req.user.balance = _debitLogInfo.balance;
          res.json({
            success: true,
            msg: 'Debit Success'
          })
        }
      }
    )
  });
});

/*Agent suspend or wake up*/
router.post('/agent/to/suspend', function (req, res, next) {

  console.log(req.body);
  var bodyEmptyCheck = util.objEmptyCheck(req.body);
  if (!bodyEmptyCheck) {
    console.log('body is empty');
    return false;
  }

  connection.query(QUERY.AGENT.SUSPEND, [req.body.suspend, req.body.code], function (err, result) {
    if (err) {
      res.json({
        success: false
      })
    } else {
      var REDIS_KEY_AGENT_LIST = 'AMS:COMMON' + req.user.agent + ':AGENTLIST';
      CommonDAO.DeleteByKeyName(req.cache, REDIS_KEY_AGENT_LIST, function (err, result) {
        if (err) {
          res.json({
            success: false,
            msg: err
          })
        } else {
          res.json({
            success: true,
            msg: 'Suspend Success!'
          })
        }
      })
    }
  });
});
/*Agent suspend or wake up*/

/*Player suspend or wake up*/
router.post('/player/to/suspend', function (req, res) {
  var bodyEmptyCheck = util.objEmptyCheck(req.body)
  if (!bodyEmptyCheck) {
    res.json({
      success: false,
      msg: 'body is empty...'
    })
  }

  connection.query(QUERY.PLAYER.UPDATE_SUSPEND, [req.body.suspend, req.body.target_user_id], function (err, result) {
    if (err) {
      res.json({
        success: false,
        msg: 'INTERNAL_ERROR'
      })
    } else {
      var REDIS_KEY_PLAYER_LIST = 'AMS:PLAYER:' + req.user.agent + ':PLAYERLIST:';
      CommonDAO.DeleteByKeyName(req.cache, REDIS_KEY_PLAYER_LIST, function (err, result) {
        if (err) {
          res.json({
            success: false,
            msg: err
          })
        } else {
          res.json({
            success: true,
            msg: 'Suspend Success!'
          })
        }
      })
    }
  })
});
/*Player suspend or wake up*/

/*Player set Password*/

router.post('/player/set/password', function (req, res) {
  var bodyEmptyCheck = util.objEmptyCheck(req.body);
  if (!bodyEmptyCheck) {
    res.json({
      success: false,
      msg: 'body is empty ... '
    })
  }

  var _obj = {
    user_id: req.body.user_id,
    password: bcrypt.hashSync(req.body.password, 10)
  };
  connection.query(QUERY.PLAYER.UPDATE_SET_PASSWORD, [_obj.password, _obj.user_id], function (err, result) {
    if (err) {
      res.json({
        success: false,
        msg: 'INTERNAL_ERROR',
      })
    } else {
      res.json({
        success: true,
        msg: 'Password change Success'
      })
    }
  })
});


/*Player Credit */
router.post('/player/credit/to/player', function (req, res, next) {
  var bodyEmptyCheck = util.objEmptyCheck(req.body);

  if (bodyEmptyCheck === false) {
    console.log('body is empty');
    return false
  }

  var _creditInfo = {
    target: req.body.target,
    amount: Number(req.body.amount)
  };

  var _creditLogInfo = {
    agent_id: req.user.agent,
    date: new Date(),
    type: 'A2P',
    amount: _creditInfo.amount,
    balance: null,
    target_agent_id: null,
    target_player_id: _creditInfo.target,
    memo: req.body.memo
  };

  var _user_wallet_log = {
    date: new Date(),
    user_id: _creditInfo.target,
    type: 'A2P',
    credit: _creditInfo.amount,
    debit: null,
    actor: _creditLogInfo.agent_id
  };

  var _date = {
    startDate: UTIL.GetCurrentDateTime('.'),
    endDate: UTIL.GetCurrentDateTime('.')
  };

  var KEY_PATTERN = 'AMS:*[' + _creditLogInfo.agent_id + ']:*';

  connection.beginTransaction(function (err) {
    async.series([
        function (callback) {
          TWOACEAPI.AddPlayerChip(_creditInfo, function (err, data) {
            callback(err, data)
          })
        },
        function (callback) {
          connection.query(QUERY.AGENT.UPDATE_AMOUNT_DEBIT, [_creditInfo.amount, _creditLogInfo.agent_id], function (err, result) {
            callback(err, result);
          })
        },
        function (callback) {
          connection.query(QUERY.AGENT.READ_CURRENT_BALANCE, [_creditLogInfo.agent_id], function (err, result) {
            _creditLogInfo.balance = result[0].balance;
            callback(err, result);
          })
        },
        function (callback) {
          connection.query(QUERY.HOME.LOG_WALLET, _creditLogInfo, function (err, result) {
            callback(err, result)
          })
        },
        function (callback) {
          connection.query(QUERY.PLAYER.CREATE_USER_WALLET_LOG, _user_wallet_log, function (err, result) {
            callback(err, result)
          })
        },
        function (callback) {
          CommonDAO.DeleteByKeyPattern(req.cache, KEY_PATTERN, function (err, result) {
            console.info('Delete ' + KEY_PATTERN + ' \'s data');
            callback(err, result)
          })
        }
      ], function (err, results) {
        if (err) {
          connection.rollback();
          console.log(err);
          err.coee = 500;
        } else {
          connection.commit();
          req.user.balance = _creditLogInfo.balance;
          res.json({
            success: true,
            msg: 'Credit Success'
          })
        }
      }
    )
  })
});
/*Player Credit END*/

/*Player Debit */
router.post('/player/debit/to/player', function (req, res, next) {
  var bodyEmptyCheck = util.objEmptyCheck(req.body);

  if (bodyEmptyCheck === false) {
    console.log('body is empty');
    return false
  }

  var _debitInfo = {
    target: req.body.target,
    amount: Number(req.body.amount)
  };

  var _debitLogInfo = {
    agent_id: req.user.agent,
    date: new Date(),
    type: 'A2P',
    amount: -(_debitInfo.amount),
    balance: null,
    target_agent_id: null,
    target_player_id: _debitInfo.target,
    memo: req.body.memo
  };

  var _user_wallet_log = {
    date: new Date(),
    user_id: _debitInfo.target,
    type: 'A2P',
    credit: null,
    debit: _debitInfo.amount,
    actor: _debitLogInfo.agent_id
  };

  var KEY_PATTERN = 'AMS:*[' + _debitLogInfo.agent_id + ']:*';

  connection.beginTransaction(function (err) {
    /* series 순서
     * 1. player new balance를  ncl api server에 저장시킨다.
     * 2. agent에게 debit한 amount value 만큼  balance를 올려준다
     * 3. player에게 debit amount value 만큼 balance를 차감한다. // 불필요 로직
     * 4. agent의 new banace를 구한다
     * 5. agent wallet history에 agent의 기로을 남긴다.
     * 6. user wallet history에 로그 기록을 남긴다.
     * */
    if (err) {
      res.json({
        success: false,
        msg: err
      });
    }
    async.series([
        function (callback) {
          TWOACEAPI.RemovePlayerChip(_debitInfo, function (err, data) {
            callback(err, data)
          })
        },
        function (callback) {
          connection.query(QUERY.AGENT.UPDATE_AMOUNT_CREDIT, [_debitInfo.amount, _debitLogInfo.agent_id], function (err, result) {
            callback(err, result);
          })
        },
        function (callback) {
          connection.query(QUERY.AGENT.READ_CURRENT_BALANCE, [_debitLogInfo.agent_id], function (err, result) {
            _debitLogInfo.balance = result[0].balance;
            callback(err, result);
          })
        },
        function (callback) {
          connection.query(QUERY.HOME.LOG_WALLET, _debitLogInfo, function (err, result) {
            console.log(_debitLogInfo);
            callback(err, result)
          })
        },
        function (callback) {
          connection.query(QUERY.PLAYER.CREATE_USER_WALLET_LOG, _user_wallet_log, function (err, result) {
            callback(err, result)
          })
        },
        function (callback) {
          CommonDAO.DeleteByKeyPattern(req.cache, KEY_PATTERN, function (err, result) {
            console.info('Delete ' + KEY_PATTERN + ' \'s data');
            callback(err, result)
          })
        }
      ], function (err, results) {
        if (err) {
          connection.rollback();
          console.log(err);
          res.json({
            success: false,
            message: err
          });
        } else {
          connection.commit();
          req.user.balance = _debitLogInfo.balance;
          res.json({
            success: true,
            msg: 'Debit Success'
          })
        }
      }
    )
  })
});
/*Player Debit END*/

/*Player create  */
//TODO 플레이어 생성시 레디스 초기화 작업 진행할것

/*Player create  */


/* GET Current selft Balance */
router.get('/agent/get/self/current/balance', function (req, res, next) {
  var agent_code = req.query.code;
  connection.query(QUERY.AGENT.READ_CURRENT_BALANCE, [agent_code], function (err, result) {
    if (err) {
      console.log(err);
      res.json({
        success: false
      });

    } else {
      if (result.balance !== null || result.balance !== undefined) {
        req.user.balance = result[0].balance;
        res.json({
          success: true,
          current_balance: result[0].balance
        });
      } else {
        res.json({
          success: false
        });
      }
    }
  })
});

/**
 *
 */
router.get('/agent/get/current/balance', function (req, res) {
  var agent_list = [req.query.my_code, req.query.target_code];

  connection.query(QUERY.AGENT.READ_CURRENT_BALANCE, [agent_list], function (err, result) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        err: err
      })
    } else {
      res.json({
        success: true,
        my_balance: result[0].balance,
        target_balance: result[1].balance
      });
    }
  })
});


/*Agent Login API
 * 해당 유저 ban 판단 로직 추가*/
router.post('/agent/login', function (req, res, next) {
  var agent = req.body.code;
  var password = req.body.password;

  connection.query(QUERY.AGENT.login, [agent], function (err, data) {
    if (err) {
      console.log('login err :' + err);
      res.json({
        success: false,
        msg: '[INTERNAL_ERROR]' + err
      })
    } else {
      if (data.length === 0) {
        res.json({
          success: false,
          msg: 'No matching agents found.'
        });
      } else {
        if (!bcrypt.compareSync(password, data[0].password)) {
          res.json({
            success: false,
            msg: 'Passwords do not match.'
          });
        } else if (data[0].suspend === 1) {
          res.json({
            success: false,
            msg: 'The agent was suspended. Please contact your administrator.'
          })
        } else {
          res.json({
            success: true
          })
        }
      }
    }
  });
});


router.get('/redis/test', function (req, res) {

  var key = '*2017.01.03*';
  CommonDAO.DeleteByKeyPattern(req.cache, key, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });

  res.json({
    result: 'result'
  })
});


/**
 *
 */

router.post('/game/history', function (req, res) {

  var _date = util.GetPastDate('-', 1);
  var REDIS_KEY = 'GAME_HISTORY::DATE:' + _date;

  var _err = {
    err_redis_create: null,
    err_mysql_create: null
  };

  /* task 작업 순서
   * 1. TWOACE API를 통해서 게임 히스토리 데이터 call
   * 2. 레디스에  리턴된  값 저장
   * 3. 레디스에 저장된  값 mysql에 저장
   * 에러가 발생하면 redis key delete, mysql date 기준으로 모든값 지우기
   * */

  console.log(REDIS_KEY);
  var task = [
    function (callback) {
      TWOACEAPI.CallPlayersGameHistoryDaily(_date, function (err, data) {
        callback(err, data);
      })
    },
    function (data, callback) {
      CommonDAO.CacheWithKeyName(req.cache, REDIS_KEY, JSON.stringify(data), function (err, redis_result) {
        _err.err_redis_create = err;
        callback(err, data)
      });
    },
    function (data, callback) {
      var game_date_obj = UTIL.switchToUserGameHistoryFormat(data);
      connection.query(QUERY.GAME.SetGameHistoryByDate, [game_date_obj], function (err, result) {
        _err.err_mysql_create = err;
        callback(err, null)
      });
    }
  ];

  /*트렌젝션도은 어떻게걸것인가?  레디스랑 myql이있는데.
   * TODO  임시 로직redis, mysql  둘중에 하나라도 오류가 일어나면 redis는 키삭제, mysql date 값으로 모든 값을 삭제한다
   * */

  async.waterfall(task, function (err, data) {
    if (_err.err_redis_create) {
      console.log('err_redis_create!!' + err);
      //TODO Redis Key 지우는 작업 진행할것
      res.json({success: false, err: _err.err_redis_create, msg: 'Error Redis Create Error, Date : ' + _date});
    }
    if (_err.err_mysql_create) {
      console.log('err_mysql_create!!' + err);
      // TODO  해당 날짜 기준으로 mysql 전부 지우는 작업 여기서 진행할것
      res.json({success: false, err: _err.err_mysql_create, msg: 'Error Mysql Create Error, Date : ' + _date});
    }
    else {
      res.json({success: true});
    }
  });
});


/*REDIS KEY ALL REMOVE API
 * 매시 35분 마다 redis key, value 삭제 API
 * */
router.delete('/redis/all', function (req, res) {
  var keyPattern = 'AMS:*';

  async.series([
    function (callback) {
      CommonDAO.DeleteByKeyPattern(req.cache, keyPattern, function (err, result) {
        callback(err, result)
      })
    }
  ], function (err, result) {
    if (err) {
      res.json({success: false, msg: 'Please try again'})
    } else {
      res.json({success: true, msg: 'Success'})
    }
  })
});


/**
 * 플레이어들의 칩정보 등을 가져오는 API
 */
router.get('/test/twoace/getPlayersInfo', function (req, res) {
  var _date = req.query.date;
  if (_date == null || _date === '') {
    _date = util.GetPastDate('-', 1);
  }

  console.log(_date);

  TWOACEAPI.CallPlayersGameHistoryDaily(_date, function (err, data) {
    if (err) {
      console.error(err);
      res.json({'success': false});
    } else {
      console.info(data);
      console.log(data.rows.length);
      console.log(data.rows[0].userId);

      res.json({
        'success': true,
        'data': data
      });
    }
  });
});


router.get('/test/twoace/getPlayerInfo', function (req, res) {
  var _player = req.query.player;
  if (_player == null || _player === '') {
    throw new Error('Parameter player is missing');
  }

  TWOACEAPI.GetPlayerChipInfo(_player, function (err, data) {
    if (err) {
      console.error(err);
      res.json({'success': false});
    } else {
      console.info(data);
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});


module.exports = router;