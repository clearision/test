$(function () {
	
	Backbone.old_sync = Backbone.sync
	Backbone.sync = function(method, model, options) {
    var new_options =  _.extend({
        beforeSend: function(xhr) {
            var token = $('meta[name="csrf-token"]').attr('content');
            if (token) xhr.setRequestHeader('X-CSRF-Token', token);
        }
    }, options)
    Backbone.old_sync(method, model, new_options);
};
	
	/////MODEL/////
	var User = Backbone.Model.extend({
		urlRoot: "server.php"
	});
	
	/////COLLECTION/////
	var Users = Backbone.Collection.extend({
		model: User,
		url: "server.php"
	});
	
	/////VIEWS/////
	
	var PhoneListView = Backbone.View.extend({
		el:'#content',
		tagName: 'ul',
		template: _.template($('#listTemplate').html()),
		
		events: {
			'click button#add': 'addItem',
			},
 
 		initialize: function () {
			this.model.bind("reset", this.render, this);
			
			var self = this;
			
			this.model.bind("add", function (user) {
				$(self.tagName, self.el).append(new PhoneListItemView({model:user}).render().el);
			});
			
			this.render();
		},
		
		render: function (eventName) {
			
			$(this.el).html(this.template());
			
			_.each(this.model.models, function (user) {
				$(this.tagName, this.el).append(new PhoneListItemView({model:user}).render().el);
			}, this);
			
			$('#apply').hide();
			$('#cancel').hide();
		},
		
		addItem: function(){
			self = this;
			
			this.user = new User({
				username: ($('#newUsername').val() != "") ? $('#newUsername').val() : 'empty',
				phoneNum: ($('#newPhoneNum').val() != "") ? $('#newPhoneNum').val() : 0
				});
			
			this.user.save(this.user, {
				wait: true,
				success: function(model,response){
					model.set({id: response});
					self.model.add(model);			
					console.log('Success saving to Db!');
				},
				error: function(model, response){
					console.log('Error saving to Db :(');
				}
			});
		},
	});
	
	var PhoneListItemView = Backbone.View.extend({
		
		tagName: 'li',
		
		events: {
			'click input#modImg':'modifyItem',
			'click input#delImg':'deleteItem'
		},
		
		template: _.template($('#itemTemplate').html()),
		
		initialize: function(){
			this.model.bind("change", this.render, this);
			this.model.bind("destroy", this.close, this);			
		},
		
		render: function(eventName){
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		},
		
		close: function(){
			$(this.el).unbind();
			$(this.el).remove();
		},
		
		deleteItem: function(){
			if(confirm('Delete this?')) this.model.destroy();
		},
		
		modifyItem: function(){
			if(confirm('Save this?')){
				this.model.save({username: $(this.el).children('#username').val(), phoneNum: $(this.el).children('#phoneNum').val()},
					{
						success: function() { alert('Record saved successfully!'); },
						errror: function() { alert('Record save error!'); }
					});
				this.render();
			}
			
		}
	});

	users = new Users();
	phoneListView = new PhoneListView({model: users});

	users.fetch({
		success: function() {
            console.log('Fetch success!');
        }
	});
			
			
	
});