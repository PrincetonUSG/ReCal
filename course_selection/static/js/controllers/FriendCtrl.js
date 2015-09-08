define(["require", "exports", './SearchCtrl'], function (require, exports, SearchCtrl) {
    'use strict';
    var FriendCtrl = (function () {
        function FriendCtrl($scope, $filter, userService, scheduleService, friendRequestResource) {
            this.$scope = $scope;
            this.$filter = $filter;
            this.userService = userService;
            this.scheduleService = scheduleService;
            this.friendRequestResource = friendRequestResource;
            this._initFriendList();
            this._initLoading();
            this._initSearchWatches();
        }
        FriendCtrl.prototype._initSearchWatches = function () {
            var _this = this;
            this.$scope.$watch(function () {
                return _this.$scope.whichSearch;
            }, function (newVal, oldVal) {
                if (newVal == oldVal) {
                    return;
                }
                if (newVal == SearchCtrl.whichSearchEnum.FRIEND_SEARCH) {
                    _this.search(_this.$scope.query);
                }
            });
            this.$scope.$watch(function () {
                return _this.$scope.query;
            }, function (newVal, oldVal) {
                if (_this.$scope.whichSearch != SearchCtrl.whichSearchEnum.FRIEND_SEARCH) {
                    return;
                }
                _this.search(newVal);
            });
        };
        FriendCtrl.prototype._initLoading = function () {
            var _this = this;
            this.$scope.loading = true;
            setTimeout(function () {
                _this.$scope.loading = false;
            }, 1000);
        };
        FriendCtrl.prototype._initFriendList = function () {
            var _this = this;
            this.$scope.data = {
                allUsers: [],
                friends: []
            };
            this.$scope.filteredUsers = this.$scope.data.allUsers;
            this.userService.all_users.then(function (users) {
                _this.$scope.data.allUsers = users;
            });
            this.userService.user.$promise.then(function (user) {
                _this.$scope.data.friends = user.friends;
            });
            this.$scope.data.friend_requests = this.friendRequestResource.query();
        };
        FriendCtrl.prototype.search = function (query) {
            this.$scope.filteredUsers =
                this.$filter("friendSearch")(this.$scope.data.allUsers, query);
            console.log("user search query: " + query);
        };
        FriendCtrl.prototype.sendRequest = function (toUser) {
            var newRequest = new this.friendRequestResource();
            newRequest.to_user = toUser;
            newRequest.from_user = this.userService.user;
            newRequest.request_accepted = false;
            console.log(newRequest);
            newRequest.$save();
        };
        FriendCtrl.prototype.defriend = function (toUser) {
        };
        FriendCtrl.prototype.acceptRequest = function (fromUser) {
        };
        FriendCtrl.prototype.onClick = function (user) {
            console.log("getting " + user.netid + "'s schedules'");
            this.scheduleService.getByUser(user.netid).$promise.then(function (schedules) {
                console.log("got " + schedules.length + " schedules");
                for (var i = 0; i < schedules.length; i++) {
                    console.log(schedules[i]);
                }
            });
        };
        FriendCtrl.$inject = [
            '$scope',
            '$filter',
            'UserService',
            'ScheduleService',
            'FriendRequestResource'
        ];
        return FriendCtrl;
    })();
    return FriendCtrl;
});
