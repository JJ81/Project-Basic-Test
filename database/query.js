const QUERY = {};

// Deprecated
/*QUERY.HOME = {
	GetNavList: 'select v.`created_dt`as updated_dt, ch.`channel_id`, ch.`title`, ch.`created_dt`, sum(v.`hits`)as hits, ch.`group_id`, ch.`active`, ch.`priority` from `channel`as ch left join (select *from `video` where `active`=true order by `created_dt` desc) as v on ch.`channel_id` = v.`channel_id` where ch.`active` =1 and not exists (select *from `group` where `title` = ch.`title`) group by ch.`channel_id` order by ch.`priority` asc;'
	, GetRecomList: 'select * from `recommend_channel` as rc ' +
	'where rc.active = true ' +
	'order by `priority` desc ' +
	'limit 3;'
	, GetNavAllList: 'select ' +
	'if(g.title is null, c.title, g.title) as title, ' +
	'if(count(g.`group_id`)=0,\'single\',\'group\') as type, ' +
	'group_concat(c.`channel_id` order by c.priority asc) as group_channel_id, ' +
	'group_concat(c.title order by c.priority asc) as group_channel_title, ' +
	'if(g.group_id is null, c.title ,g.group_id) as group_id ' +
	'from `channel` as c ' +
	'left join `group` as g ' +
	'on c.group_id = g.group_id ' +
	'where c.active=true ' +
	'group by group_id ' +
	'order by c.priority asc;'
};*/

QUERY.USER = {
	Login: 'select * from `user` where `user_id`=?;',
	FailToLogin: 'update `user` set `login_fail_count`=`login_fail_count`+1 where `user_id`=?;',
	ClearFailedCount: 'update `user` set `login_fail_count`=0  where `user_id`=?;',
	UpdateGameLog: 'insert into `log_access_game` set `user_id` = ?'
	// SignUp: 'insert into `user` set ?;',
	// DuplicateByUserId: 'select `user_id` from `user` where `user_id` = ?;',
	// DuplicateByNickname: 'select `nickname` from `user` where `nickname` = ?;',
	// DuplicateByEmail: 'select `email` from `user` where `email` = ?;',
};

QUERY.Reply = {
	GetListByVideoID :
		'select * from `reply_video` '+
		'where `video_id`=? ' +
		'and `comment_id` is null ' +
		'and `layer` is null ' +
		'order by `created_dt` desc ' +
		'limit ?, ?;',
	Write: 'insert into `reply_video` (`video_id`, `user_id`, `comment`) values(?,?,?);',
	ReadById :
		'select * from `reply_video` ' +
		'where `user_id`=? ' +
		'and `id`=?;',
	UpdateById :
		'update `reply_video` set `comment`=? ' +
		'where `id`=? and `user_id`=?;',
	DeleteById :
		'delete from `reply_video` ' +
		'where `id`=? and `user_id`=?;'
};

QUERY.ReReply = {
	Create :
		'insert into `reply_video` (`video_id`, `comment`, `comment_id`, `layer`, `user_id`) ' +
		'values(?,?,?,?,?);',
		// todo Reply와 중복으로 일단 두고 개선 comment_id 참조 관계 정의 필요
	ReadById :
		'select * from `reply_video` ' +
		'where `user_id`=? ' +
		'and `id`=?;',
	UpdateById :
		'update `reply_video` set `comment`=? ' +
		'where `id`=? and `user_id`=?;',
	DeleteById :
		'delete from `reply_video` ' +
		'where `id`=? and `user_id`=?;',
	GetListByVideoID :
		'select * from `reply_video` '+
		'where `video_id`=? ' +
		'and `comment_id` is not null ' +
		'and `layer` is not null ' +
		'order by `created_dt` asc ' +
		'limit ?, ?;'
};

QUERY.BROADCAST = {
	GET : 'select * from `broadcast` order by `start_dt` desc limit 1;'
};

QUERY.NAVI = {
	CHANNEL_ALL_ORDERED :
		'select ch.channel as super_channel, ch.title as super_title, ch.type, group_concat(ch.channel_id order by ch.priority desc) as sub_channel, group_concat(cn.title order by ch.priority desc) as sub_title ' +
		'from `channel_new` as cn ' +
		'inner join ( ' +
			'select cn.channel_id as channel, cn.title, cn.type, cn.description, cn.created_dt, cn.priority, cn.active, if(cg.group_id is null, cn.title, cg.group_id) as group_id, if(cg.channel_id is null, cn.channel_id, cg.channel_id) as channel_id ' +
			'from `channel_new` as cn ' +
			'left join `channel_group` as cg ' +
			'on cn.group_id = cg.group_id ' +
		') as ch ' +
		'on ch.channel_id = cn.channel_id ' +
		'where ch.type != \'U\' ' +
		'group by ch.group_id ' +
		'order by ch.priority desc;',
	CHANNEL_RECOM :
		'select channels.*, cr.priority as recom_priority from ' +
		'(select ch.channel as super_channel, ch.title as super_title, ch.type, group_concat(ch.channel_id order by ch.priority desc) as sub_channel, group_concat(cn.title order by ch.priority desc) as sub_title ' +
		'from `channel_new` as cn ' +
		'inner join ( ' +
			'select cn.channel_id as channel, cn.title, cn.type, cn.description, cn.created_dt, cn.priority, cn.active, if(cg.group_id is null, cn.title, cg.group_id) as group_id, if(cg.channel_id is null, cn.channel_id, cg.channel_id) as channel_id ' +
		'from `channel_new` as cn ' +
		'left join `channel_group` as cg ' +
		'on cn.group_id = cg.group_id ' +
		') as ch ' +
		'on ch.channel_id = cn.channel_id ' +
		'where ch.type != \'U\' ' +
		'group by ch.group_id) as channels ' +
		'inner join ' +
		'(select * from `contents` ' +
		'where `type`=\'R\' '+
		'order by `priority` desc, `created_dt` desc)' +
		' as cr ' +
		'on channels.super_channel = cr.ref_id ' +
		'order by cr.priority desc;'
};

QUERY.CONTENTS = {
	RECENT_VIDEO_LIST :
		'select * from `video` ' +
		'order by `priority` desc, `created_dt` desc ' +
		'limit ?, ?;',
	RepresentativeList :
		'select * from `contents` ' +
		'where `type`=\'RT\' ' +
		'order by `priority` desc, `created_dt` desc ' +
		'limit ?,?;',
	EducationList :
		'select * from `contents` ' +
		'where `type`=\'E\' ' +
		'order by `priority` desc, `created_dt` desc ' +
		'limit ?,?;',
	SummaryList :
		'select * from `contents` ' +
		'where `type`=\'S\' ' +
		'order by `priority` desc, `created_dt` desc ' +
		'limit ?,?;',
};

QUERY.EVENT = {
	LIST :
		'select * from `event` ' +
		'order by `created_dt` desc ' +
		'limit ?,?;',
	RESULT :
		'select * from `event_result` ' +
		'where `event_id`=?;',
	VOTE_QUESTION :
		'select * from `vote_question` where `id`=?;',
	VOTE_ANSWER : // 결과는 리스트가 아닌 도표 혹은 그래프로 보여주어야 한다. 프론트에서 API로 댕겨간 데이터를 핸들링하자
		'select * from `vote_answer` where vote_id=?;'
};

QUERY.VIDEO = {
	LIST :
		'select * from `video` ' +
		'where `channel_id`=? ' +
		'order by `created_dt` desc;',
	GetInfoByVideoId :
		'select * from `video` where `video_id`=?;'
};

QUERY.CHANNEL = {
	GetById :
		'select * from `channel_new` where channel_id=?;'
};


QUERY.NEWS = {
	LIST :
		'select * from `news` ' +
		'where `active`=true ' +
		'order by `created_dt` desc ' +
		'limit ?;'
};

module.exports = QUERY;