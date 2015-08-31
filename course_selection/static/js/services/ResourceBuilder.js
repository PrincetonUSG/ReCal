/// <reference path='../../ts/typings/tsd.d.ts' />
define(["require", "exports"], function (require, exports) {
    var ResourceBuilder = (function () {
        function ResourceBuilder($resource, localStorageService) {
            this.$resource = $resource;
            this.localStorageService = localStorageService;
        }
        ResourceBuilder.prototype.getCourseResource = function () {
            return this.$resource(ResourceBuilder.BASE_URL + 'course/', {}, {
                query: {
                    method: 'GET',
                    isArray: false,
                },
                getBySemester: {
                    method: 'GET',
                    isArray: true,
                    cache: true,
                    transformResponse: this.transformTastypieResponse
                }
            });
        };
        ResourceBuilder.prototype.getColorResource = function () {
            return this.$resource(ResourceBuilder.BASE_URL + 'color_palette/', {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: this.transformTastypieResponse
                }
            });
        };
        ResourceBuilder.prototype.getScheduleResource = function () {
            return this.$resource(ResourceBuilder.BASE_URL + 'schedule/:id', { id: '@id' }, {
                query: {
                    method: 'GET',
                    isArray: false
                },
                getByUser: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: this.transformTastypieResponse
                },
                update: {
                    method: 'PUT',
                    params: {}
                }
            });
        };
        ResourceBuilder.prototype.getUserResource = function () {
            return this.$resource(ResourceBuilder.BASE_URL + 'user/:id', {}, {
                getByNetId: {
                    method: 'GET',
                    isArray: false,
                    transformResponse: this.getFirstObject
                }
            });
        };
        ResourceBuilder.prototype.getFriendRequestResource = function () {
            return this.$resource(ResourceBuilder.BASE_URL + 'friend_relationship/:id', {}, {
                query: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: this.transformTastypieResponse
                }
            });
        };
        ResourceBuilder.prototype.getSemesterResource = function () {
            return this.$resource(ResourceBuilder.BASE_URL + 'semester/', {}, {
                getByTermCode: {
                    method: 'GET',
                    isArray: false,
                    transformResponse: this.getFirstObject
                },
                query: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: this.transformTastypieResponse
                }
            });
        };
        ResourceBuilder.prototype.transformTastypieResponse = function (data, header) {
            var parsed = JSON.parse(data);
            if (parsed.meta && parsed.objects) {
                return parsed.objects;
            }
            else {
                return parsed;
            }
        };
        ResourceBuilder.prototype.getFirstObject = function (data, header) {
            var parsed = JSON.parse(data);
            return parsed.objects[0];
        };
        ResourceBuilder.$inject = [
            '$resource',
            'localStorageService'
        ];
        ResourceBuilder.V1_URL = "/course_selection/api/v1/";
        ResourceBuilder.BASE_URL = ResourceBuilder.V1_URL;
        return ResourceBuilder;
    })();
    return ResourceBuilder;
});
