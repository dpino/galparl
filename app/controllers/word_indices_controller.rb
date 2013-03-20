class WordIndicesController < ApplicationController
  # GET /word_indices
  # GET /word_indices.json
  def index
    @word_indices = WordIndex.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @word_indices }
    end
  end

  # GET /word_indices/1
  # GET /word_indices/1.json
  def show
    @word_index = WordIndex.where(:word => params[:id]).first

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @word_index }
    end
  end

end
