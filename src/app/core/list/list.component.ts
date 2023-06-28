import { Component, HostListener, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/posts.service';
import { DetailBottomSheet } from '../detail-bottom-sheet/detail-bottom-sheet.component';
import { DetailModal, ModalData } from '../detail-modal/detail-modal.component';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    posts$: Observable<Array<Post>>;
    totalPosts: Array<Post> = [];
    foundEnd = false;
    scrollDown$: BehaviorSubject<void> = new BehaviorSubject(null);
    isLoading = false;
    windowSize: 'xl' | 'sm' | 'md' | 'lg' = null;
    apiError = false;
    start = 0;
    limit = 10;
    offset = 10;

    constructor(
        public dialog: MatDialog,
        private postsService: PostsService,
        private bottomSheet: MatBottomSheet) {

        this.setWindowSize(document.body.clientWidth);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event?): void {
        this.setWindowSize(event.target.innerWidth);
    }

    ngOnInit(): void {
        this.posts$ = this.scrollDown$.pipe(
            tap(() => (this.isLoading = this.foundEnd ? false : true)),
            delay(2000),
            switchMap(() =>
                this.foundEnd ?
                    of(null) :
                    this.postsService.getPosts(this.start, this.limit)
                        .pipe(
                            catchError((err) => {
                                console.log(err);
                                this.apiError = true;
                                throw new Error(err);
                            })
                        )
            ),
            map((posts: Post[]) => {
                const result = posts ? posts.concat(this.totalPosts) : this.totalPosts;
                if (posts) this.totalPosts.push(...posts);
                this.start = this.start + this.offset;
                this.isLoading = false;
                if (posts?.length === 0) this.foundEnd = true;
                return result;
            })
        );

        this.scrollDown$.next();
    }

    onScroll(event: any): void {
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight && !this.isLoading) {
            this.scrollDown$.next();
        }
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
}