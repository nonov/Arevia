<?php namespace Api\Http\Controllers;

use Auth;
use Hash;
use DB;
use Mail;
use Illuminate\Contracts\Auth\Registrar;
use Api\Http\Requests;
use Api\Http\Controllers\Controller;

use Illuminate\Http\Request;

class MailController extends Controller {

	/**
	 * Display the specified resource.
	 *
	 * @return Response
	 */
	public function index()
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
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(Request $request)
	{
		error_log($request->input('message'));
		Mail::send('emails.activation', ['firstname' => $request->input('firstname'), 'lastname' => $request->input('lastname'), 'object' => $request->input('object'), 'content' => $request->input('message')], function($message)
		{
			$message->to('nono.viricel@gmail.com', 'Arevia')->subject('Arevia : un client vous a laissé un message !');
		});
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
	public function destroy($id)
	{
		//
	}

}
