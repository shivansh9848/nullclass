import React from 'react'
import moment from 'moment'
import { Link, useParams } from 'react-router-dom'
import Avatar from '../../Comnponent/Avatar/Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { deleteanswer } from '../../action/question'
import { voteAnswer } from '../../action/users'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import './Displayanswer.css'

const Displayanswer = ({ question, handleshare }) => {
    const user = useSelector((state) => state.currentuserreducer)
    const { id } = useParams();
    const dispatch = useDispatch()

    const handledelete = (answerid, noofanswers) => {
        dispatch(deleteanswer(id, answerid, noofanswers - 1))
    }

    const handleAnswerVote = (answerid, value) => {
        dispatch(voteAnswer(id, answerid, value))
    }

    return (
        <div>
            {question.answer.map((ans) => (
                <div className="display-ans" key={ans._id}>
                    <div className="answer-content">
                        <div className="answer-voting">
                            <button
                                type='button'
                                className={`vote-btn ${ans.upvote?.includes(user?.result?._id) ? 'voted' : ''}`}
                                onClick={() => handleAnswerVote(ans._id, 'upvote')}
                                disabled={!user?.result}
                            >
                                <FontAwesomeIcon icon={faArrowUp} />
                            </button>
                            <span className="vote-count">{(ans.upvote?.length || 0) - (ans.downvote?.length || 0)}</span>
                            <button
                                type='button'
                                className={`vote-btn ${ans.downvote?.includes(user?.result?._id) ? 'voted' : ''}`}
                                onClick={() => handleAnswerVote(ans._id, 'downvote')}
                                disabled={!user?.result}
                            >
                                <FontAwesomeIcon icon={faArrowDown} />
                            </button>
                        </div>
                        <div className="answer-body">
                            <p>{ans.answerbody}</p>
                        </div>
                    </div>
                    <div className="question-actions-user">
                        <div>
                            <button type='button' onClick={handleshare} >Share</button>
                            {user?.result?._id === ans?.userid && (
                                <button type='button' onClick={() => handledelete(ans._id, question.noofanswers)}>Delete</button>
                            )}
                        </div>
                        <div>
                            <p>answered {moment(ans.answeredon).fromNow()}</p>
                            <Link to={`/Users/${ans.userid}`} className='user-limk' style={{ color: "#0086d8" }}>
                                <Avatar backgroundColor="lightgreen" px="2px" py="2px" borderRadius="2px">
                                    {ans.useranswered.charAt(0).toUpperCase()}
                                </Avatar>
                                <div>{ans.useranswered}</div>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Displayanswer