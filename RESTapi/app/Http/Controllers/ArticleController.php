<?php namespace Api\Http\Controllers;

use DB;
use Auth;
use Api\Http\Requests;
use Api\Http\Controllers\Controller;

use Illuminate\Http\Request;

class ArticleController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index(Request $request)
	{
		$result = DB::select('select * from articles order by id desc');
		if(count($result)) 
		{
			foreach ($result as $article) {
				$article->date = date('F d, Y', strtotime($article->date));
			}
			return response()->json($result);
		}
		return response("Selection Failed.", 451);
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
		if($request->file('file')->isValid() && Auth::check())
		{
			$filePath = '/Arevia/app/imgDrop/article_'.str_random(20).".".$request->file('file')->guessExtension();
			if($request->file('file')->move('../../app/imgDrop/', $filePath))
			{
				return response($filePath);	
			}
		}
		return response("upload failure.", 441);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(Request $request)
	{
		if(DB::insert('insert into articles (title, content, img_path) values (?, ?, ?)', [$request->input('title'), $request->input('content'), $request->input('img_path')])) 
		{
			return response("1");
		} 
		return response("Insertion Failed.", 450);
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
		if(DB::delete('delete from articles where id = ?', [$id]))
		{
			DB::delete('delete from posts where article_id = ?', [$id]);	
			return response("Delete Success");
		}
		return response("Delete Failed.", 452);
	}
}
