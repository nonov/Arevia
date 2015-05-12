<?php namespace Api\Http\Controllers;

use DB;
use Auth;
use Api\Http\Requests;
use Api\Http\Controllers\Controller;

use Illuminate\Http\Request;

class PostController extends Controller {

	/**
	 * Display a listing of the resource.
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
		if(DB::insert('insert into posts (article_id, content, firstname, email) values (?, ?, ?, ?)', [$request->input('id'), $request->input('content'), $request->input('firstname'), $request->input('email')])) 
		{
			return response("1");
		} 
		return response("Insertion Failed.", 460);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$result = DB::select('select * from posts where article_id = ? order by id desc', [$id]);
		if(count($result)) 
		{
			foreach ($result as $article) {
				$article->publish_date = date('F d, Y', strtotime($article->publish_date));
			}
			return response()->json($result);
		}
		return response("Selection Failed.", 451);
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
		if(DB::delete('delete from posts where id = ?', [$id]))
		{
			return response("Delete Success");
		}
		return response("Delete Failed.", 452);
	}
}
