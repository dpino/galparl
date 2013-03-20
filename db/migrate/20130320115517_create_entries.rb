class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.int :numid
      t.int :season
      t.int :date
      t.string :person
      t.text :body

      t.timestamps
    end
  end
end
