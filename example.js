angular.module('ui.bootstrap.demo', ['ngAnimate', 'ui.bootstrap', 'Notification']);
angular.module('ui.bootstrap.demo')
.controller('AlertDemoCtrl',['$scope', 'notification', function ($scope, notification) {
  
  $scope.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];

  var notify = new notification({$scope: null});

  $scope.addAlert = function() {
    notify.showNotification({ type: 'success', message: 'Well done!.'+ new Date()}, 3000);
  };

  $scope.addAlert1 = function() {
    notify.showPermanentNotification({ type: 'warning', message: 'Well done1!.'+ new Date()});
  };

}]);