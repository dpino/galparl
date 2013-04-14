class Word 
  # attr_accessible :count, :word, :indices, :speakers, :error
   
  def initialize(word)
    word_index = WordIndex.where(:word => word).first

    if (word_index != nil) 
        @speakers = groupBySpeakers(getEntries(word_index.indice))
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

  def groupBySpeakers(entries)
    speakers = Hash.new()
    entries.each { |entry|
        speaker = entry.person
        if (speakers.has_key?(speaker))
            bodies = speakers[speaker]
        else
            bodies = Array.new()     
        end
        bodies.push(encapsulateEntry(entry))
        speakers[speaker] = bodies
    }
    return speakers
  end

  def encapsulateEntry(entry)
    return {
        :body => entry.body,
        :date => entry.date,
        :season => entry.season,
        :numid => entry.numid
    };
  end

end
