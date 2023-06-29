import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    constructor(private http: HttpClient) { }

    getPosts(start?: number, limit?: number): Observable<Array<Post>> {
        let url = `https://jsonplaceholder.typicode.com/posts`;
        const urlParams = [];
        if (!_.isNil(start)) {
            urlParams.push(`_start=${start}`);
        }
        if (!_.isNil(limit)) {
            urlParams.push(`_limit=${limit}`);
        }

        if (urlParams.length > 0) {
            url += '?' + urlParams.join('&');
        }

        return this.http.get(url) as Observable<Array<Post>>;
    }
}
