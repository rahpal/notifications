'use strict';

(function (angular, factory){
	if (typeof define === 'function' && define.amd) {
        define(['angular'], function (angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
})(angular || null, function (angular){

	angular.module('Notification', [])
	.factory('notification', ['$rootScope', '$q', function($rootScope, $q){

		return function (baseSettings){

			var self = this,
				settings = {
					$scope: null
				};

			/* Show notification with delay. */
			self.showNotification  = function(item, delay){
				$rootScope.$broadcast('showNotification', angular.extend(item, {delay: delay}));
			};

			/* Show notification permanently. */
			self.showPermanentNotification  = function(item){
				$rootScope.$broadcast('showNotification', item);
			};

			self.settings = function(newSettings){
				if(angular.isDefined(newSettings)){
					angular.extend(settings, newSettings);
					return this;
				}
				return settings;
			};

			self.settings(baseSettings);
		};
	}])
	.directive('notification', function ($timeout, $compile){
		return {
			restrict: 'EA',
			scope: true,
			replace: true,
			template: '<div class="notifications_container"></div>', 
			link: function(scope, element, attrs){
				scope.timeoutPromise = null;

				scope.close = function(isPrm){
					if(!isPrm){
						scope.hideNotification = true;
					}else{
						scope.hidePrmNotification = true;
					}
				};

				/* modify dom here. */
				scope.$on('showNotification', function(evt, params){
					clearNotification(!!params.delay? false: true);
					addNotification(params);

					/* Timeout logic */
					if(!!params.delay){
						scope.hideNotification = false;

						if(!!scope.timeoutPromise){
							$timeout.cancel(scope.timeoutPromise);
							scope.timeoutPromise = null;
						}

						scope.timeoutPromise = $timeout(function(){
							scope.hideNotification = true;
						}, params.delay, true);
					}else{
						scope.hidePrmNotification = false;
					}
				});

				var addNotification = function(params){
					var notification_markup = null;

			        if (!!params.delay) {
			            notification_markup = '<div ng-hide="hideNotification" class="fadable notification ' + params.type + '">' +
													'<p>' + params.message + '</p>' +
													'<a href="javascript:void(0);" ng-click="close(false)" class="pull-right"><i class="remove glyphicon glyphicon-remove-sign glyphicon-white"></a>' +
												'</div>';
			        }else{
			        	notification_markup = '<div ng-hide="hidePrmNotification" class="fadable permanant_notification ' + params.type + '">' +
													'<p>' + params.message + '</p>' +
													'<a href="javascript:void(0);" ng-click="close(true)" class="pull-right"><i class="remove glyphicon glyphicon-remove-sign glyphicon-white"></a>' +
												'</div>';
			        }

			        angular.element(element).prepend($compile(notification_markup)(scope));
				};

				var clearNotification = function(isPermanantNotification){
					if (isPermanantNotification) {
			            angular.element(document.querySelector(".notifications_container > .permanant_notification")).remove();
			        }
			        else {
			            angular.element(document.querySelector(".notifications_container > .notification")).remove();
			        }
				};
			}
		};
	});
});