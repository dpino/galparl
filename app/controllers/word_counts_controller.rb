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
    @word_count = WordCount.where(:word => params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @word_count }
    end
  end

  # GET /word_counts/new
  # GET /word_counts/new.json
  def new
    @word_count = WordCount.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @word_count }
    end
  end

  # GET /word_counts/1/edit
  def edit
    @word_count = WordCount.find(params[:id])
  end

  # POST /word_counts
  # POST /word_counts.json
  def create
    @word_count = WordCount.new(params[:word_count])

    respond_to do |format|
      if @word_count.save
        format.html { redirect_to @word_count, notice: 'Word count was successfully created.' }
        format.json { render json: @word_count, status: :created, location: @word_count }
      else
        format.html { render action: "new" }
        format.json { render json: @word_count.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /word_counts/1
  # PUT /word_counts/1.json
  def update
    @word_count = WordCount.find(params[:id])

    respond_to do |format|
      if @word_count.update_attributes(params[:word_count])
        format.html { redirect_to @word_count, notice: 'Word count was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @word_count.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /word_counts/1
  # DELETE /word_counts/1.json
  def destroy
    @word_count = WordCount.find(params[:id])
    @word_count.destroy

    respond_to do |format|
      format.html { redirect_to word_counts_url }
      format.json { head :no_content }
    end
  end
end
