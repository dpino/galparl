class WordCountsController < ApplicationController
  # GET /word_counts
  # GET /word_counts.json
  def index
    @word_counts = WordCount.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @word_counts }
    end
  end

  # GET /word_counts/1
  # GET /word_counts/1.json
  def show
    @word_count = WordCount.where(:word => params[:id]).first

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @word_count }
    end
  end

end
