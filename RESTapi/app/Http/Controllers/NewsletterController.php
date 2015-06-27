<?php namespace Api\Http\Controllers;

use Auth;
use Hash;
use DB;
use Mail;
use Newsletter;
use Illuminate\Contracts\Auth\Registrar;
use Api\Http\Requests;
use Api\Http\Controllers\Controller;

use Illuminate\Http\Request;

class NewsletterController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index(Request $request)
	{
		//
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Set Article Image.
	 *
	 * @return Response
	 */
	public function setPicture(Request $request)
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(Request $request)
	{
		if(count($result = DB::select('select * from newsletter where email = ?', [$request->input('email')])) === 0)
		{
			if(DB::insert('insert into newsletter (email) values (?)', [$request->input('email')]))
			{
				return response('Added to the list of subscriber');
			}
		} else
		{
			return response('Already on the database', 481);
		}
		return response('Add to the database failed', 484);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}

	public function sendEmail(Request $request)
	{
		$article = $request->all();
		if(count($destinataires = DB::select('select * from newsletter'))) {
			foreach ($destinataires as $key => $value) {
				$value = (array) $value;
				$article['email'] = $value['email'];
				$article['token'] = str_random(20);
				DB::update('update newsletter set token = ? where email = ?', [$article['token'], $article['email']]);
				Mail::send('emails.newsletter', $article, function($message) use ($value) { 
					$message->to($value['email'], 'Arevia')->subject('Un nouvel article est sur Arevia Coaching !');
				});
			}
			return response('Email Send Success !');
		} else
		{
			return response('No subscribers', 483);
		}
		return response('Send failed', 482);
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function delete(Request $request)
	{
		if(DB::delete('delete from newsletter where email = ? and token = ?', [$request->input('email'), $request->input('token')]))
		{
			return response('User well deleted');
		}
		return response('Delete from newsletter has failed', 480);
	}
}
