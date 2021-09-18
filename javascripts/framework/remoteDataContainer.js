/**
 * Class: rdc 
 * Meta: Either register the object beforehand, otherwise it will be initialised upon the first call of a container.
 */

rdc = {
	// Remote objects currently registered in the container
	'rdObjs': {},

	'load' : function(rdObjCat, rdObjId){
		this.rdObjs[rdObjCat][rdObjId].load();
	},

	'clear' : function() {
		rdc.rdObjs = {};
	},

	'loadRdCat' : function(rdObjCat) {
		if (!this.rdObjs.hasOwnProperty(rdObjCat))
			return;

		for(rdObjKey in this.rdObjs[rdObjCat]) {
			this.rdObjs[rdObjCat][rdObjKey].load();
		}
	},

	'rdObjCreate' : function(rdObjCat, rdObjId, wait) {
		var rdObj = new this.rdObj(rdObjCat, rdObjId);
		this.rdObjs[rdObjCat][rdObjId] = rdObj;
		rdObj.load(wait);
		return rdObj;
	},

	'rdListenerRegister': function(rdObjCat, rdObjId, targetHandler, outParserId, wait, isCreateObj) {

		var listener = new rdc.rdListener(targetHandler, outParserId);
		if (!this.rdObjs.hasOwnProperty(rdObjCat)){
			this.rdObjs[rdObjCat] = {};
		}

		if (!this.rdObjs[rdObjCat].hasOwnProperty(rdObjId) || isCreateObj){
			rdObj = this.rdObjCreate(rdObjCat, rdObjId, wait);

		} else {
			var rdObj = this.rdObjs[rdObjCat][rdObjId];

		}

        rdObj.attach(listener);
    },

	'rdObj' : function(rdObjCat, rdObjId){
		this.rdObjCat = rdObjCat;
		this.rdObjId  = rdObjId;
		this.response = null;

		this.listeners = new Array();

		this.isListenerRegistered = function(rdListener){
			// foreach listeners , check if the provided listener is registered.
			for(registeredListener in this.listeners)
			{
				if (registeredListener == rdListener)
					return true;
			}
			return false;
		};

		//fnCallBack: we need that call-back function to trigger something after RDC populating some element
		this.attach = function(rdListener, fnCallBack){
		    if(this.isListenerRegistered(rdListener)==false)
			this.listeners.push(rdListener);
			this.feedListeners(rdListener, fnCallBack);
		};

		this.load = function(wait){
			// loads the ajax, on completed, calls the parsers and populates the listeners
			this.response = null;
			var actionURL = rdc.registry[rdObjCat].actionURL(this.rdObjId);
			this.feedListeners(); // displays loaders while loading

			$.ajax({
		        url 		: apiPath + actionURL,
		        data 		: '',
		        type 		: 'GET',
		        async		: wait?false:true,
		        dataType	: 'json',
		        context		: this,
		        success		: function(data){
		        	targetRdObj = $(this).get(0);
		        	targetRdObj.response = data;
		        	targetRdObj.feedListeners();
		        },
		        statusCode:{
		            401: function() {
		            	makePageCalls("login");
		            }
		        }
			});
		};

		this.feedListeners = function(listener){
			if (listener == undefined){
				for(var currentListener in this.listeners){
					rdc.rdOutputParser.parseInto(this.listeners[currentListener], this.response);
				}
			} else {
				rdc.rdOutputParser.parseInto(listener, this.response);
			}
		};
	},
	'rdListener' : function(targetHandler, outParserId){
		this.targetHandler = targetHandler;

		this.outParserId = outParserId;
	},
	'namespace' : 'javascripts/framework/rdc/'
};
