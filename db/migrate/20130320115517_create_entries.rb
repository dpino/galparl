class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.integer :numid
      t.integer :season
      t.integer :date
      t.string :person
      t.text :body

      t.timestamps
    end
  end
end
