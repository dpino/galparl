class CreateWordIndices < ActiveRecord::Migration
  def change
    create_table :word_indices do |t|
      t.string :word
      t.text :indice

      t.timestamps
    end
  end
end
