require 'test_helper'

class WordIndicesControllerTest < ActionController::TestCase
  setup do
    @word_index = word_indices(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:word_indices)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create word_index" do
    assert_difference('WordIndex.count') do
      post :create, word_index: { indice: @word_index.indice, word: @word_index.word }
    end

    assert_redirected_to word_index_path(assigns(:word_index))
  end

  test "should show word_index" do
    get :show, id: @word_index
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @word_index
    assert_response :success
  end

  test "should update word_index" do
    put :update, id: @word_index, word_index: { indice: @word_index.indice, word: @word_index.word }
    assert_redirected_to word_index_path(assigns(:word_index))
  end

  test "should destroy word_index" do
    assert_difference('WordIndex.count', -1) do
      delete :destroy, id: @word_index
    end

    assert_redirected_to word_indices_path
  end
end
