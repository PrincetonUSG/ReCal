/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
'use strict';

class SemCtrl {
    public static $inject =[
        '$scope',
        'localStorageService'
        ];

    // TODO: get this from the server
    private static CURRENT_SEMESTER_TERM_CODE = 1152;
    private static LAST_AVAILABLE_TERM_CODE = 1154;
    private semesters;

    constructor(private $scope,
            private localStorageService) {
        this.$scope.vm = this;
        this.$scope.userData = this.$scope.$parent.data;
        this.semesters = [];
        // this.restoreUserSemesters();
        this.$scope.semesters = this.semesters;
        this.$scope.canAdd = this.canAdd();

    }

    // private restoreUserSemesters() {
    //     var prev = this.localStorageService.get('nice-semesters');
    //     if (prev != null) {
    //         this.semesters = prev;
    //     }
    // }

    public setAllInactive() {
        angular.forEach(this.semesters, (semester) => {
            semester.active = false;
        });
    }

    private canAdd(): boolean {
        return this.getNewSemesterTermCode() <= SemCtrl.LAST_AVAILABLE_TERM_CODE;
    }
 
    private getNewSemesterTermCode(): number {
        if (this.semesters.length == 0) {
            return SemCtrl.CURRENT_SEMESTER_TERM_CODE;
        }

        var lastTermCode = this.semesters[this.semesters.length - 1].term_code;
        if (this.semesterIsFall(lastTermCode)) {
            // fall to spring, from 2 to 4
            return lastTermCode + 2;
        } else {
            // spring to fall, from 4 to 12
            return lastTermCode + 8;
        }
    }

    private addNewSemester() {
        var id = this.semesters.length + 1;
        var term_code = this.getNewSemesterTermCode();
        var title = this.getTitle(term_code);
        this.semesters.push({
            id: id,
            title: title,
            active: true,
            current: term_code >= SemCtrl.CURRENT_SEMESTER_TERM_CODE,
            term_code: term_code
        });

        // this.localStorageService.set('nice-semesters', this.semesters);
        this.$scope.canAdd = this.canAdd();
    }

    private getTitle(termCode: number): string {
        // take mid 2 numbers: _XX_
        var endYear = Math.floor((termCode % 1000) / 10);
        var startYear = endYear - 1;
        var semester = this.semesterIsFall(termCode) ? "Fall" : "Spring";
        return "" + startYear + "-" + endYear + " " + semester;
    }
 
    public addSemester() {
        this.setAllInactive();
        this.addNewSemester();
    }    

    private semesterIsFall(termCode): boolean {
        return termCode % 10 == 2;
    }
}

export = SemCtrl;
