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
    @word_index = WordIndex.where(:word => params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @word_index }
    end
  end

  # GET /word_indices/new
  # GET /word_indices/new.json
  def new
    @word_index = WordIndex.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @word_index }
    end
  end

  # GET /word_indices/1/edit
  def edit
    @word_index = WordIndex.find(params[:id])
  end

  # POST /word_indices
  # POST /word_indices.json
  def create
    @word_index = WordIndex.new(params[:word_index])

    respond_to do |format|
      if @word_index.save
        format.html { redirect_to @word_index, notice: 'Word index was successfully created.' }
        format.json { render json: @word_index, status: :created, location: @word_index }
      else
        format.html { render action: "new" }
        format.json { render json: @word_index.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /word_indices/1
  # PUT /word_indices/1.json
  def update
    @word_index = WordIndex.find(params[:id])

    respond_to do |format|
      if @word_index.update_attributes(params[:word_index])
        format.html { redirect_to @word_index, notice: 'Word index was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @word_index.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /word_indices/1
  # DELETE /word_indices/1.json
  def destroy
    @word_index = WordIndex.find(params[:id])
    @word_index.destroy

    respond_to do |format|
      format.html { redirect_to word_indices_url }
      format.json { head :no_content }
    end
  end
end
