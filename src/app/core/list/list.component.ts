import { Component, HostListener, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/posts.service';
import { DetailBottomSheet } from '../detail-bottom-sheet/detail-bottom-sheet.component';
import { DetailModal, ModalData } from '../detail-modal/detail-modal.component';
import { catchError, delay, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
    @Output() foundTotalElements = new EventEmitter();
    @Output() somethingWrong = new EventEmitter();

    posts$: Observable<Array<Post>>;
    totalPosts: Array<Post> = [];
    foundEnd = false;
    scrollDown$: BehaviorSubject<void> = new BehaviorSubject(null);
    isLoading = false;
    windowSize: 'xl' | 'sm' | 'md' | 'lg' = null;
    apiError = false;
    start = 0;
    limit = 20;
    offset = 20;

    isListScrollable = false;
    tooltipText = 'If the client display is too wide and the container element has no scroll, it can trigger the refresh through this button';
    private destroy$: Subject<void> = new Subject();

    constructor(
        public dialog: MatDialog,
        private postsService: PostsService,
        private bottomSheet: MatBottomSheet) {

        this.setWindowSize(document.body.clientWidth);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event?): void {
        this.setWindowSize(event.target.innerWidth);
        this.isListScrollable = this.checkIfScrollable();
    }

    ngOnInit(): void {
        this.isListScrollable = this.checkIfScrollable();
        
        this.posts$ = this.scrollDown$.pipe(
            tap(() => (this.isLoading = this.foundEnd ? false : true)),
            delay(2000),
            switchMap(() =>
                this.foundEnd ?
                    of(null) :
                    this.postsService.getPosts(this.start, this.limit)
                        .pipe(
                            takeUntil(this.destroy$),
                            catchError((err) => {
                                this.apiError = true;
                                this.somethingWrong.emit(true);
                                throw new Error(err);
                            })
                        )
            ),
            filter((posts: Post[]) => !_.isNil(posts)),
            map((posts: Post[]) => {
                const result = this.totalPosts.concat(posts);
                this.totalPosts.push(...posts);
                this.start = this.start + this.offset;
                this.limit = 10;
                this.offset = 10;
                this.isLoading = false;
                if (posts?.length === 0) {
                    this.foundTotalElements.emit(true);
                    this.foundEnd = true;
                }
                return result;
            })
        );
    }

    onScroll(event: any): void {
        if (Math.ceil(event.target.offsetHeight + event.target.scrollTop) >= event.target.scrollHeight && !this.isLoading) {
            this.scrollDown$.next();
        }
    }

    refresh(): void {
        if (!this.isLoading && !this.foundEnd) {
            this.scrollDown$.next();
        }
    }

    checkIfScrollable(): boolean {
        var div = document.getElementById('posts_div');
        return div.scrollHeight <= div.clientHeight;
    }


    setWindowSize(windowSize: number): void {
        if (windowSize >= 1200) {
            this.windowSize = 'xl';
        }
        else if (windowSize > 1025 && windowSize < 1200) {
            this.windowSize = 'lg';
        }
        else if (windowSize > 770 && windowSize <= 1025) {
            this.windowSize = 'md';
        }
        else if (windowSize <= 770) {
            this.windowSize = 'sm';
        }
    }

    openDialog(post: Post): void {
        const modalData: ModalData = { id: post.id, title: post.title, body: post.body };

        if (this.windowSize === 'sm') {
            this.bottomSheet.open(DetailBottomSheet, {
                data: modalData
            });
        } else {
            this.dialog.open(DetailModal, {
                data: modalData
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}