# Schema
* Global/Public

* Exam_abcd1234

# Tables (Global)
## Exams
* Exam id (Exam_<thisbit>)
* Duration
* Room (Divided class?)
* 

## IP Bans  (Manual bannage of IP's)
* IP (Number?, Unique, Not Null)
* Expires (Time)

## IP Connections (For limiting)
* IP
* Time  ( clear row when time expires )


# Tables (Exam_abcd1234)

## Related Exams
* ID
* Title
* Exam ID

## Links
* ID
* Title
* Link

## Sections
* ID
* Parent Section
* Title
* Number
* NumberType

## Questions
* ID 
* ParentQuestion (Question/Section containing this question)
* Number         (Order in question) 
* ChildrenNumberStyle (Numbering style children will take)
* BodyText  (Text for the question (if empty, then is just a container))
* SupercededBy  (Link to revision of question after it) (if empty, is the question)
* SupercededComment (Comment on what changed between this and next revision)
* Created (Date)
* Author (who posted the question)

## Question-Comments
* ID
* Parent Question
* Text
* Author
* Created (Date)

## Answers
* ID
* Parent Question
* Votes_Up
* Votes_Down
* SupercededBy
* SuperceddedComment
* Text
* Author
* Created (Date)

## Answers-Comments
* ID
* Parent Answer
* Text
* Author
* Created (Date)

## Users
* ID
* NameNoun (Identidy from color + noun)
* NameColor 
* LastActive (Fuzzed slightly)
* Created (Date)

## Bans  // Shadow bans
* UserID

# Testing...

1. This is an explanation right now, pretty cool
    a) What is the point of this
    b) What is the point of this either

Question
    Title: None
    Text: This is an explanation right now, pretty cool
    Children:
        Question
            Title: None
            Text: What is the point of this
        Question
            Title: None
            Text: What is the point of this either

The Explaination
This is an explaination
    i) What is the explaination?
    ii) Why is the sky blue


Question
    Title: The Explaination
    Text: The explaination
    Number: None
    ChildrenNumberStyle: Roman
    Children:
        Question:
            Title: None
            Text: What is the explaination
            Number: 1
            
            