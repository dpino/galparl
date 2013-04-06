class Word 
  # attr_accessible :count, :word, :indices, :entries, :error
   
  def initialize(word)
    word_index = WordIndex.where(:word => word).first

    if (word_index != nil) 
        @entries = getEntries(word_index.indice)
        @count = WordCount.where(:word => word).first.count
        @word = word
    else 
        @error = "No results found for <i>'#{word}'</i>";
    end
  end

  def getEntries(indice)
    indice = indice.split(",")
    return Entry.find(:all, :conditions => ['numid in (?)', indice])
  end

end
