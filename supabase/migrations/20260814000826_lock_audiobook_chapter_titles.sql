-- Lock Formless chapter titles to the final nine names.
-- Opening Credits, Introduction, and Acknowledgments stay as they are.

update public.audiobook_tracks
set chapter_title = case chapter_number
  when 2 then 'Awareness and the Ego'
  when 3 then 'Past Pain, Time and the Present Moment'
  when 4 then 'Resistance and Surrender'
  when 5 then 'Conscious Relationships'
  when 6 then 'Work, Identity and Purpose'
  when 7 then 'Nature, Animals and Presence'
  when 8 then 'Science, Spirituality and Consciousness'
  when 9 then 'Living in Freedom'
  else chapter_title
end
where book_slug = 'formless'
  and chapter_number between 2 and 9;
