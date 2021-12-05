var HTTP = 'http://api.cailing.meisheapp.com/',
		WXHTTP = '/meishe-wxapi',
		ROOT = location.origin + location.pathname,
		SHARE_LINK = "http://m.meisheapp.com/videoRinging/?name=demo";

// 服务器地址
// if (process.env.NODE_ENV === "development") {
//   HTTP = 'http://api.cailing.meisheapp.com/';
// 	WXHTTP = '/meishe-wxapi';
// }else {
//   HTTP = 'http://api.cailing.meisheapp.com/';
// 	WXHTTP = '/meishe-wxapi';
// }

module.exports = {
	HTTP: HTTP,
	WXHTTP: WXHTTP,
	ROOT: ROOT,
	SHARE_LINK: SHARE_LINK
}
