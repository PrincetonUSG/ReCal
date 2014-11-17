define(["require", "exports", '../models/CourseEventSources', '../models/CompositeEventSources'], function(require, exports, CourseEventSources, CompositeEventSources) {
    'use strict';

    var CalendarCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        function CalendarCtrl($scope, testSharingService, colorResource) {
            var _this = this;
            this.$scope = $scope;
            this.testSharingService = testSharingService;
            this.colorResource = colorResource;
            this.$scope.vm = this;
            this.initConfig();

            this.$scope.data = testSharingService.getData();

            // var previewColor = this.colorResource.getPreviewColor();
            // this.$scope.previewEventSource = {
            //     events: [],
            //     color: this.colorResource.toPreviewColor(previewColor.light),
            //     textColor: this.colorResource.toPreviewColor(previewColor.dark)
            // };
            this.compositeEventSources = new CompositeEventSources();
            this.$scope.eventSources = this.compositeEventSources.getEventSources();

            this.$scope.$watch(function () {
                return _this.$scope.data.previewCourse;
            }, function (newCourse, oldCourse) {
                return _this.updatePreviewCourse(newCourse, oldCourse);
            }, true);

            // collection watch
            this.$scope.$watchCollection(function () {
                return _this.$scope.data.enrolledCourses;
            }, function (newCourses, oldCourses) {
                return _this.updateEnrolledCourses(newCourses, oldCourses);
            });

            // equality watch
            this.$scope.$watch(function () {
                return _this.$scope.data.enrolledSections;
            }, function (newSections, oldSections) {
                return _this.updateEnrolledSections(newSections, oldSections);
            }, true);
        }
        CalendarCtrl.prototype.initConfig = function () {
            this.$scope.uiConfig = CalendarCtrl.defaultUiConfig;
        };

        ///////////////////////////////////////////////////////////////////
        // Course Management
        // ////////////////////////////////////////////////////////////////
        CalendarCtrl.prototype.addCourse = function (course, isPreview) {
            var myColor = isPreview ? this.colorResource.getPreviewColor() : this.colorResource.nextColor();
            var courseEventSources = new CourseEventSources(course, myColor, isPreview);
            this.compositeEventSources.addEventSources(courseEventSources);
        };

        CalendarCtrl.prototype.removeCourse = function (course, isPreview) {
            this.compositeEventSources.removeEventSources(course.id, isPreview);
        };

        CalendarCtrl.prototype.clearPreviewCourse = function (course) {
            this.removeCourse(course, true);
        };

        CalendarCtrl.prototype.setPreviewCourse = function (course) {
            this.addCourse(course, true);
        };

        CalendarCtrl.prototype.updatePreviewCourse = function (newCourse, oldCourse) {
            if (newCourse === oldCourse || (newCourse !== null && oldCourse !== null && newCourse.id === oldCourse.id))
                return;

            if (newCourse == null) {
                this.clearPreviewCourse(oldCourse);
            } else {
                this.setPreviewCourse(newCourse);
            }

            this.$scope.eventSources = this.compositeEventSources.getEventSources();
        };

        CalendarCtrl.prototype.getRemovedCourse = function (newCourses, oldCourses) {
            var removedIdx = CalendarCtrl.NOT_FOUND;
            for (var i = 0; i < newCourses.length; i++) {
                if (newCourses[i].id !== oldCourses[i].id) {
                    // they are different, meaning oldCourses[i] got removed
                    removedIdx = i;
                    break;
                }
            }

            if (removedIdx == CalendarCtrl.NOT_FOUND) {
                removedIdx = newCourses.length;
            }

            return oldCourses[removedIdx];
        };

        CalendarCtrl.prototype.updateEnrolledCourses = function (newCourses, oldCourses) {
            if (newCourses === oldCourses)
                return;

            // course added
            if (newCourses.length == oldCourses.length + 1) {
                var course = newCourses[newCourses.length - 1];
                this.addCourse(course, false);
            } else if (newCourses.length == oldCourses.length - 1) {
                var removedCourse = this.getRemovedCourse(newCourses, oldCourses);
                this.removeCourse(removedCourse, false);
            }
        };

        ///////////////////////////////////////////////////////
        // Sections
        // ////////////////////////////////////////////////////
        CalendarCtrl.prototype.addAllSectionEventSources = function (course, colors) {
            for (var i = 0; i < course.section_types.length; i++) {
                // this.addAllSectionEventSourcesByType(course.id, course.section_types[i]);
            }
        };

        CalendarCtrl.prototype.removeAllSectionEventSources = function (course) {
            for (var i = this.$scope.eventSources.length - 1; i >= 0; i--) {
                var curr = this.$scope.eventSources[i];
                if (curr.course_id == course.id) {
                    this.$scope.eventSources.splice(i, 1);
                }
            }
        };

        // TODO: refactor this
        CalendarCtrl.prototype.updateEnrolledSections = function (newSections, oldSections) {
            if (newSections == oldSections) {
                return;
            }

            // return directly if a course has been added or removed
            if (Object.keys(newSections).length != Object.keys(oldSections).length) {
                return;
            }

            for (var course_id in newSections) {
                // hack to compare jsons, replies on the fact that the order of
                // fields stay the same
                if (JSON.stringify(newSections[course_id]) != JSON.stringify(oldSections[course_id])) {
                    var old = oldSections[course_id];
                    var curr = newSections[course_id];
                    for (var section_type in curr) {
                        if (curr[section_type] == old[section_type]) {
                            continue;
                        }

                        console.log('section type: ' + section_type + ' has changed in course ' + course_id);

                        // TODO: what if old[section_type] == null?
                        // SHOULD REMOVE ALL
                        // this.removeEventSourceByType(course_id, section_type);
                        // we want to render all events associated with this section_type
                        if (curr[section_type] == null) {
                            // this.addAllSectionEventSourcesByType(course_id, section_type);
                        } else {
                            // this.addEventSourceById(course_id, curr[section_type], CalendarCtrl.StatusEnum.SELECTED);
                        }
                    }
                }
            }
        };
        CalendarCtrl.NOT_FOUND = -1;
        CalendarCtrl.StatusEnum = {
            PREVIEWED: 0,
            HIGHLIGHTED: 1,
            SELECTED: 2
        };

        CalendarCtrl.defaultUiConfig = {
            height: 1200,
            contentHeight: 'auto',
            editable: false,
            header: {
                left: '',
                center: '',
                right: ''
            },
            defaultView: "agendaWeek",
            weekends: false,
            firstDay: 1,
            columnFormat: {
                week: 'dddd'
            },
            //slotDuration: '02:00',
            allDaySlot: false,
            minTime: '08:00',
            maxTime: '23:00',
            timeFormat: '',
            slotEventOverlap: false
        };

        CalendarCtrl.$inject = [
            '$scope',
            'TestSharingService',
            'ColorResource'
        ];
        return CalendarCtrl;
    })();

    
    return CalendarCtrl;
});
