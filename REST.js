function REST_ROUTER(router,connection,md5){
	var self = this;
	self.handleRoutes(router, connection,md5);
}
REST_ROUTER.prototype.handleRoutes = function(router,connction,md5){
	router.get('/rest',function(req,res){
		res.json({"Message": "Hello World !"});
	});
}
module.export = REST_ROUTER;
