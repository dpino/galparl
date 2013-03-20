class Word 
  # attr_accessible :count, :word, :indices, :entries
   
  def initialize(word)
    word_index = WordIndex.where(:word => word).first

    @entries = getEntries(word_index.indice)
    @count = WordCount.where(:word => word).first.count
    @word = word
  end

  def getEntries(indice)
    indice = indice.split(",")
    return Entry.find(:all, :conditions => ['numid in (?)', indice])
  end

end
