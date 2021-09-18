/**
 * Registry of remote data categories, 
*/

rdc.registry =
{
	'balance_single': 
	{
		'actionURLBase'	: 'mny/balance',
		'actionURL'	: function(rdObjId)
		{
			return this.actionURLBase + '/' + rdObjId;
		}
	},
	'spending_single': 
	{
		'actionURLBase' : 'mny/balance',
		'actionURL'	: function(rdObjId)
		{
			return this.actionURLBase + '/' + rdObjId;
		}
	},
	'saving_single': 
	{
		'actionURLBase'	: 'mny/balance',
		'actionURL'	: function(rdObjId)
		{
			return this.actionURLBase + '/' + rdObjId;
		}
	},
	'user_details': 
	{
		'actionURLBase'	: 'user/details',
		'actionURL'	: function(rdObjId)
		{
			return this.actionURLBase + '/' + rdObjId+'?type=full'; 
		}
	},
	'available_to_spend':
	{
		'actionURLBase' : 'mny/balance',
		'actionURL'	: function(rdObjId)
		{
			return this.actionURLBase + '/' + rdObjId;
		}
	},
};
