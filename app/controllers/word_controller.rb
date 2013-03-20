class WordController < ApplicationController

  def show
    word = Word.new(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: word}
    end
  end

end
