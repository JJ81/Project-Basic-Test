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
	RecordLoginTime : 'update `user` set `last_login_dt` = CURRENT_TIMESTAMP where `user_id`=?;',
	// FailToLogin: 'update `user` set `login_fail_count`=`login_fail_count`+1 where `user_id`=?;',
	// ClearFailedCount: 'update `user` set `login_fail_count`=0  where `user_id`=?;',
	// UpdateGameLog: 'insert into `log_access_game` set `user_id` = ?, `last_login_dt` = ?;',
	SignUp: 'insert into `user` set ?;',
	DuplicateByUserId :
	`
	select user_id from user where user_id = ?;
	`,
	DuplicateByNickname:
	`
	select nickname from user where nickname=?;
	`,
	DuplicateByEmail:
		'select `email` from `user` where `email`=?;',
	GetInfo :
	`
	select * from user where user_id=? and nickname=?;
	`,
	ChangeEmail :
	`
	update user set email=? where user_id=? and nickname=?;
	`,
	QueryMarketCode :
	`
	select market_code from user where user_id=? and nickname=?;
	`,
	InsertMarketCode :
	`
	update user set market_code=? where user_id=? and nickname=?;
	`,
	UpdatePassword :
	`
	update user set password=? where user_id=? and nickname=?;
	`,
	UserWithNicknameAndEmail :
	`
	select user_id, auth_id, password from user where nickname=? and email=?;
	`,
	UserWithUserIdAndEmail :
	`
	select user_id, email from user where user_id=? and email=?;
	`
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
	`
	select c.channel_id as super_channel, c.title as super_title, c.type, c.priority, group_concat(c2.title order by c2.priority asc) as sub_title, group_concat(c2.channel_id order by c2.priority asc) as sub_channel from (
	select cs.channel_id, cs.title, cs.type, cs.description, cs.created_dt, cs.priority, if(cs.group_id is null, cs.title, cs.group_id) as group_id, cs.hit_count, cs.active from channels as cs
	where cs.type != 'U' and cs.active=true
	) as c
	left join (
		select * from channels as c2
		where c2.type = 'U' and c2.active=true
	) as c2
	on c2.group_id = c.group_id
	group by c.group_id
	order by c.priority asc;
	`,
	// `
	// select ch.channel as super_channel, ch.title as super_title, ch.type, group_concat(ch.channel_id order by ch.priority desc) as sub_channel, group_concat(cn.title order by ch.priority desc) as sub_title
	// from channels as cn
	// inner join (
	// select cn.channel_id as channel, cn.title, cn.type, cn.description, cn.created_dt, cn.priority, cn.active, if(cg.group_id is null, cn.title, cg.group_id) as group_id, if(cg.channel_id is null, cn.channel_id, cg.channel_id) as channel_id
	// from channels as cn
	// left join (
	// select channel_id, group_id from channels
	// where type != 'S' and group_id is not null
	// order by priority desc
	// ) as cg
	// on cn.group_id = cg.group_id
	// ) as ch
	// on ch.channel_id = cn.channel_id
	// where ch.type != 'U'
	// group by ch.group_id
	// order by ch.priority asc;
	// `,
	// `
	// select ch.channel as super_channel, ch.title as super_title, ch.type, group_concat(ch.channel_id order by ch.priority desc) as sub_channel, group_concat(cn.title order by ch.priority desc) as sub_title
	// from channels as cn
	// inner join (
	// 	select cn.channel_id as channel, cn.title, cn.type, cn.description, cn.created_dt, cn.priority, cn.active, if(cg.group_id is null, cn.title, cg.group_id) as group_id, if(cg.channel_id is null, cn.channel_id, cg.channel_id) as channel_id
	// 	from channels as cn
	// 	left join channels as cg
	// 	on cn.group_id = cg.group_id
	// ) as ch
	// on ch.channel_id = cn.channel_id
	// where ch.type != 'U'
	// group by ch.group_id
	// order by ch.priority desc;
	// `,
		// 'select ch.channel as super_channel, ch.title as super_title, ch.type, group_concat(ch.channel_id order by ch.priority desc) as sub_channel, group_concat(cn.title order by ch.priority desc) as sub_title ' +
		// 'from `channels` as cn ' +
		// 'inner join ( ' +
		// 	'select cn.channel_id as channel, cn.title, cn.type, cn.description, cn.created_dt, cn.priority, cn.active, if(cg.group_id is null, cn.title, cg.group_id) as group_id, if(cg.channel_id is null, cn.channel_id, cg.channel_id) as channel_id ' +
		// 	'from `channels` as cn ' +
		// 	'left join `channel_group` as cg ' +
		// 'on cn.group_id = cg.group_id ' +
		// ') as ch ' +
		// 'on ch.channel_id = cn.channel_id ' +
		// 'where ch.type != \'U\' ' +
		// 'group by ch.group_id ' +
		// 'order by ch.priority desc;',
	CHANNEL_RECOM :
	`
	select c.channel_id as super_channel, c.title as super_title, c.type, rc.priority, group_concat(c2.title order by c2.priority asc) as sub_title, group_concat(c2.channel_id order by c2.priority asc) as sub_channel from (
		select cs.channel_id, cs.title, cs.type, cs.description, cs.created_dt, cs.priority, if(cs.group_id is null, cs.title, cs.group_id) as group_id, cs.hit_count, cs.active from channels as cs
		where cs.type != 'U' and cs.active=true
	) as c
	left join (
		select * from channels as c2
		where c2.type = 'U' and c2.active=true
	) as c2
	on c2.group_id = c.group_id
	inner join (
		select channel_id, priority from contents
		where type='R' and active=true
	) as rc
	on rc.channel_id = c.channel_id
	group by c.group_id
	order by rc.priority asc;
	`,
		// 'select channels.*, cr.priority as recom_priority from ' +
		// '(select ch.channel as super_channel, ch.title as super_title, ch.type, group_concat(ch.channel_id order by ch.priority desc) as sub_channel, group_concat(cn.title order by ch.priority desc) as sub_title ' +
		// 'from `channel_new` as cn ' +
		// 'inner join ( ' +
		// 	'select cn.channel_id as channel, cn.title, cn.type, cn.description, cn.created_dt, cn.priority, cn.active, if(cg.group_id is null, cn.title, cg.group_id) as group_id, if(cg.channel_id is null, cn.channel_id, cg.channel_id) as channel_id ' +
		// 'from `channel_new` as cn ' +
		// 'left join `channel_group` as cg ' +
		// 'on cn.group_id = cg.group_id ' +
		// ') as ch ' +
		// 'on ch.channel_id = cn.channel_id ' +
		// 'where ch.type != \'U\' ' +
		// 'group by ch.group_id) as channels ' +
		// 'inner join ' +
		// '(select * from `contents` ' +
		// 'where `type`=\'R\' '+
		// 'order by `priority` desc, `created_dt` desc)' +
		// ' as cr ' +
		// 'on channels.super_channel = cr.ref_id ' +
		// 'order by cr.priority desc;'
		// 'select channels.*, cr.priority as recom_priority from ' +
		// '(select ch.channel as super_channel, ch.title as super_title, ch.type, group_concat(ch.channel_id order by ch.priority desc) as sub_channel, group_concat(cn.title order by ch.priority desc) as sub_title ' +
		// 'from `channels` as cn ' +
		// 'inner join ( ' +
		// 'select cn.channel_id as channel, cn.title, cn.type, cn.description, cn.created_dt, cn.priority, cn.active, if(cg.group_id is null, cn.title, cg.group_id) as group_id, if(cg.channel_id is null, cn.channel_id, cg.channel_id) as channel_id ' +
		// 'from `channels` as cn ' +
		// 'left join `channels` as cg ' +
		// 'on cn.group_id = cg.group_id ' +
		// ') as ch ' +
		// 'on ch.channel_id = cn.channel_id ' +
		// 'where ch.type != \'U\' ' +
		// 'group by ch.group_id) as channels ' +
		// 'inner join ' +
		// '(select * from `contents` ' +
		// 'where `type`=\'R\' '+
		// 'order by `priority` desc, `created_dt` desc)' +
		// ' as cr ' +
		// 'on channels.super_channel = cr.channel_id ' +
		// 'order by cr.priority desc;'
};

QUERY.CONTENTS = {
	RECENT_VIDEO_LIST :
		// 'select * from `video` ' +
		// 'where active=true ' +
		// 'order by `priority` desc, `created_dt` desc ' +
		// 'limit ?, ?;',
		// 'select `video_id`, `channel_id`, `title`, `hits`, `type`, `link` from `video` ' +
		// 'where active=true ' +
		// 'order by `priority` desc, `created_dt` desc ' +
		// 'limit ?, ?;',
	`
	select video_id, channel_id, title, hits, type, link from video
	where active=true
	order by priority desc, created_dt desc
	limit 0, 4;
	`,
	RepresentativeList :
		// 백틱을 사용하 + 기호를 사용하여 개행을 할 필요가 없어진다.
		`
			select * from contents as cs
			inner join channel as c
			on cs.channel_id = c.channel_id
			where cs.type=\'RT\' and cs.active=true
			order by cs.priority desc, cs.created_dt desc
			limit ?,?;
		`,

		// 'select * from `contents` as cs ' +
		// 'inner join `channel` as c ' +
		// 'on cs.channel_id = c.channel_id ' +
		// 'where cs.`type`=\'RT\' and cs.active=true ' +
		// 'order by cs.priority desc, cs.created_dt desc ' +
		// 'limit ?,?;',
	EducationList :
		'select * from `contents` as cs ' +
		'inner join `video` as v ' +
		'on v.video_id = cs.video_id ' +
		'where cs.`type`=\'E\' and cs.active=true ' +
		'order by cs.`priority` desc, cs.`created_dt` desc ' +
		'limit 0, 4;',
		// 'select * from `contents` ' +
		// 'where `type`=\'E\' ' +
		// 'order by `priority` desc, `created_dt` desc ' +
		// 'limit ?,?;',
	SummaryList :
		// 'select * from `contents` ' +
		// 'where `type`=\'S\' ' +
		// 'order by `priority` desc, `created_dt` desc ' +
		// 'limit ?,?;',
		'select * from `contents` as cs ' +
		'inner join `video` as v ' +
		'on v.video_id = cs.video_id ' +
		'where cs.`type`=\'S\' and cs.active=true ' +
		'limit ?, ?;'
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
	`
	select * from video
	where channel_id=?
	order by title asc, created_dt asc;
	`,
		// 'select * from `video` ' +
		// 'where `channel_id`=? ' +
		// 'order by `title` asc, `created_dt` asc;',
	GetInfoByVideoId :
		'select * from `video` where `video_id`=?;'
};

QUERY.CHANNEL = {
	GetById :
		'select * from `channels` where channel_id=?;'
};


QUERY.NEWS = {
	LIST :
	'select * from `news` ' +
	'where `active`=true ' +
	'order by `created_dt` desc ' +
	'limit ?;'
};

module.exports = QUERY;