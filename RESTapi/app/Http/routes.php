<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::post('user/login', 'UserController@authenticate');
Route::get('user/logout', 'UserController@logout');
Route::resource('api/user','UserController');

Route::post('api/article/setPicture', 'ArticleController@setPicture');
Route::resource('api/article','ArticleController');

Route::resource('api/post', 'PostController');

Route::resource('api/file', 'FileController');

Route::resource('api/mail', 'MailController');