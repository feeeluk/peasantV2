import Link from "next/link"
import { SignedOut } from '@clerk/nextjs'
import { connect } from "@/app/utils/connect"
import { QuizCard } from "@/app/components/QuizCard"
import { QuizFilterSort } from "@/app/components/QuizFilterSort"

export default async function Home({searchParams}){

    let filterByCategory = ``
    let sortBy = ``
    let orderBy = ``
    
    if(!searchParams.filterByCategory || searchParams.filterByCategory == "all")
        {
            filterByCategory = ``
        }

    else if(searchParams.filterByCategory !== " ")
        {
                filterByCategory = `WHERE category_name = '${searchParams.filterByCategory}'`
        }

    if(!searchParams.sortBy || searchParams.sortBy == 'quiz_name')
        {
            sortBy = `quiz_name`
        }

    else if(searchParams.sortBy == 'category_name')
        {
                sortBy = 'category_name'
        }
    
    if(!searchParams.orderBy || searchParams.orderBy == 'asc')
        {
            orderBy = `asc`
        }

    else if(searchParams.orderBy == 'desc')
        {
                orderBy = `desc`
        }

    console.log(sortBy)
    const db = connect()

    const quizzes = (await db.query(`SELECT quizzes.quiz_id, quizzes.quiz_name, categories.category_name, categories.category_image
                                    FROM quizzes
                                    JOIN categories
                                    ON quizzes.quiz_category_id = category_id
                                    ${filterByCategory}
                                    ORDER BY ${sortBy} ${orderBy}`)).rows

    let quizNames = (await db.query(`SELECT quizzes.quiz_name
                                        FROM quizzes`)).rows

    let categories = (await db.query(`SELECT category_name
                                        FROM categories`)).rows
    
    quizNames = JSON.stringify(quizNames)
    categories = JSON.stringify(categories)

    return(
        <div className="StandardLayout">

            <div className="Title">
                <h1>Home</h1>
            </div>

            <SignedOut>
                <div className="PageMessage">
                    <p>** You must be signed in to play **</p>
                </div>
            </SignedOut>     
            

            <div className="FilterSortBar">
                <QuizFilterSort quizzes={quizNames} categories={categories} />
            </div>
                
            <div className="AllQuizzes">

                <div className="QuizCards">
                    {quizzes.map( (quiz) => {
                    return(
                        <div key={quiz.quiz_id}>
                            <Link href={`quiz/${quiz.quiz_id}/1`}>
                                <QuizCard key={quiz.quiz_id} name={quiz.quiz_name} category={quiz.category_name} image={quiz.category_image}/>
                            </Link>
                        </div>
                        )
                    })}
                </div>
                
            </div>
            
        </div>
        
    )
}