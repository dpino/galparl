require 'test_helper'

class WordCountsControllerTest < ActionController::TestCase
  setup do
    @word_count = word_counts(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:word_counts)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create word_count" do
    assert_difference('WordCount.count') do
      post :create, word_count: { count: @word_count.count, word: @word_count.word }
    end

    assert_redirected_to word_count_path(assigns(:word_count))
  end

  test "should show word_count" do
    get :show, id: @word_count
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @word_count
    assert_response :success
  end

  test "should update word_count" do
    put :update, id: @word_count, word_count: { count: @word_count.count, word: @word_count.word }
    assert_redirected_to word_count_path(assigns(:word_count))
  end

  test "should destroy word_count" do
    assert_difference('WordCount.count', -1) do
      delete :destroy, id: @word_count
    end

    assert_redirected_to word_counts_path
  end
end
