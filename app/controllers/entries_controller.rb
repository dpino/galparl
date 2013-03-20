class EntriesController < ApplicationController
  # GET /entries
  # GET /entries.json
  def index
    @entries = Entry.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @entries }
    end
  end

  # GET /entries/1
  # GET /entries/1.json
  def show
    @entry = Entry.where(:numid => params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @entry }
    end
  end

end
