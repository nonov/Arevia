<?php namespace Api\Http\Controllers;

use Auth;
use Hash;
use DB;
use Mail;
use Illuminate\Contracts\Auth\Registrar;
use Api\Http\Requests;
use Api\Http\Controllers\Controller;

use Illuminate\Http\Request;

class UserController extends Controller {


	public function __construct(Request $request, Registrar $registrar)
	{
		$this->_request = $request;
		$this->_registrar = $registrar;
		if(Auth::check()) $this->_user = Auth::user();
		else $this->_user = null;
	}

	/**
	 * Authenticate the user.
	 *
	 * @return Response
	 */
	public function authenticate(Request $request)
	{
		if(Auth::attempt(['login' => $request->input('login'), 'password' => $request->input('password')]))
		{
			$this->_user = Auth::user();
				return response()->json(["id" => csrf_token(), "user" => $this->_user]);
		}
		return 0;
	}

	public function logout()
	{
		return response(Auth::logout());
	}
	/**
	 * Display the specified resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		if(Auth::check())
		{
			return response()->json(["id" => csrf_token(), "user" => $this->_user]);
		}
		return response(0);
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
