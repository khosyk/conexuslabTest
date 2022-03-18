import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isId, setIsId] = useState(null);
  const [vieSurvey, setViewSurvey] = useState(true);
  const [eventAsnwer, setEventAnswer] = useState(true);
  const [data, setData] = useState(null);
  return (
    <div className="App">
      <GetUserId setViewSurvey={setViewSurvey} setIsId={setIsId} />
      {vieSurvey ? <Survey setData={setData} setEventAnswer={setEventAnswer} isId={isId} /> : ''}
      {eventAsnwer ? <EventAnswer /> : ''}
    </div>
  );
}

function GetUserId({ setViewSurvey, setIsId }) {

  const [input, setInput] = useState({
    userId: null,
  })
  const onInput = (e) => {
    const { value } = e.target;
    setInput({
      userId: value
    })
  }

  const requestId = async () => {
    await axios.request(input.userId);
    setViewSurvey(true);
  }

  const showSurvey = (e) => {
    if (input.userId !== '') {
      requestId();
      setIsId(input.userId);
      document.querySelector('table').style.display = 'block';
    } else {
      alert('아이디를 입력해주세요.')
    }
  }


  return (
    <div>
      <span>ID를 입력 하시면 설문조사를 진행하실수 있습니다.</span>
      <input
        className='user_id'
        type='text'
        maxLength={12}
        onInput={(e) => onInput(e)}
        placeholder='아이디를 입력해주세요.'></input>
      <input
        className='user_id_btn'
        type='submit'
        onClick={() => showSurvey()}
      >
      </input>
    </div>
  )
}

function Survey({ setEventAnswer, isId, setData }) {
  const [surveyDate, setSurveyDate] = useState([]);
  const [multi, setMulti] = useState([]);
  const [answers, setAnswers] = useState({
    "1": null,
    "2": null,
    "3": null,
    "4": [],
    "5": null,
  })

  var now = new Date();
  var time = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    date: now.getDate(),
    hours: now.getHours(),
    minutes: now.getMinutes(),
  };

  const getData = async () => {
    await axios.get('http://event.conexuslab.co.kr/survey/1')
      .then((data) => setData(data.json()))
  }

  useEffect(() => {
    getTime()
    getData();
    return () => {
      getData()
      getTime()
    };
  }, [answers, multi])

  const getTime = () => {
    const { year, month, date, hours, minutes } = time;
    const startTime = `${year}/${month}/${date} ${hours}:${minutes}`;
    setSurveyDate([...surveyDate, startTime])
  }

  const handleCheck = (checked, id) => {
    if (multi.includes('neither')) {
      if (checked) {
        setMulti([]);
        setMulti([id]);
      }
      else {
        setMulti(multi.filter((e) => e !== id))
      }
    } else {
      if (checked) {

        setMulti([...multi, id]);
      }
      else {
        setMulti(multi.filter((e) => e !== id))
      }
    }
  }

  const handleResetCheck = (checked, id) => {
    if (checked) {
      setMulti(['neither']);
    } else {
      setMulti([]);
    }
  }

  const sendData = async () => {
    await axios.post('http://event.conexuslab.co.kr/survey/1/answers', JSON.stringify({
      user_id: isId,
      value: answers
    }))
  }

  const handleSend = () => {
    if (answers[1] && answers[2] && answers[3] && answers[4] !== [] && answers[5]) {
      setEventAnswer(true);
      setAnswers({ ...answers, "4": multi });
      sendData();
      localStorage.setItem('user_id', JSON.stringify(isId))
      localStorage.setItem('value', JSON.stringify(answers))
    } else {
      alert('모든 질문에 답변 하셔야 합니다.');
      return;
    }
  }
  return (
    <>
      <table>
        <tbody>
          <tr className='input_id'>
            <td>
              ID. 012
            </td>
          </tr>
          <tr className='title'>
            <td>
              커넥서스랩 설문조사
            </td>
          </tr>
          <tr className='input_header'>
            <td>
              <img src='#' alt='#'></img>
            </td>
          </tr>
          <tr className='created_datetime'>
            <td>
              {surveyDate ? surveyDate[0] : ''}
            </td>
          </tr>
          <tr className='updated_datetime'>
            <td>
              업데이트 시간
              {surveyDate ? surveyDate[surveyDate.length - 1] : ''}
            </td>
          </tr>
          <tr className="block1">
            <th>서비스지향성</th>
            <td>
              <div>
                <input
                  type="radio" id="low" name="degree1" value="low" onClick={() => setAnswers({ ...answers, "1": [0] })}
                />
                <label htmlFor="degree1">나쁨</label>
              </div>
              <div>
                <input type="radio" id="mid" name="degree1" value="mid"
                  onClick={() => setAnswers({ ...answers, "1": [1] })}
                />
                <label htmlFor="degree1">보통</label>
              </div>
              <div>
                <input type="radio" id="high" name="degree1" value="high" onClick={() => setAnswers({ ...answers, "1": [2] })}
                />
                <label htmlFor="degree1">좋음</label>
              </div>
            </td>
          </tr>
          <tr className="block2">
            <th>업무 전문성</th>
            <td>
              <div>
                <input
                  type="radio" id="low" name="degree2" value="low" onClick={() => setAnswers({ ...answers, "2": [0] })}
                />
                <label htmlFor="degree2">나쁨</label>
              </div>
              <div>
                <input type="radio" id="mid" name="degree2" value="mid"
                  onClick={() => setAnswers({ ...answers, "2": [1] })}
                />
                <label htmlFor="degree2">보통</label>
              </div>
              <div>
                <input type="radio" id="high" name="degree2" value="high" onClick={() => setAnswers({ ...answers, "2": [2] })}
                />
                <label htmlFor="degree2">좋음</label>
              </div>
            </td>
          </tr>
          <tr className="block3">
            <th>능동적 도전성</th>
            <td>
              <div>
                <input
                  type="radio" id="low" name="degree3" value="low" onClick={() => setAnswers({ ...answers, "3": [0] })}
                />
                <label htmlFor="degree3">나쁨</label>
              </div>
              <div>
                <input type="radio" id="mid" name="degree3" value="mid"
                  onClick={() => setAnswers({ ...answers, "3": [1] })}
                />
                <label htmlFor="degree3">보통</label>
              </div>
              <div>
                <input type="radio" id="high" name="degree3" value="high" onClick={() => setAnswers({ ...answers, "3": [2] })}
                />
                <label htmlFor="degree3">좋음</label>
              </div>
            </td>
          </tr>
          <tr className="block4">
            <th>협업과 커뮤니케이션</th>
            <td>
              <input checked={multi.includes('coop') ? true : false} type="checkbox" id="coop" name="commu" onChange={(e) => handleCheck(e.target.checked, e.target.id)} />
              <label htmlFor="commu">협력적이다.</label>
              <input checked={multi.includes('nar') ? true : false} type="checkbox" id="nar" name="commu" onChange={(e) => handleCheck(e.target.checked, e.target.id)} />
              <label htmlFor="commu">의사소통을 잘한다.</label>
              <input type="checkbox" id="neither" name="commu" onChange={(e) => handleResetCheck(e.target.checked, e.id)} />
              <label htmlFor="commu">둘 다 아니다.</label>
            </td>
          </tr>
          <tr className="block5">
            <th>긍정 에너지</th>
            <td>
              <div>
                <input
                  type="radio" id="low" name="degree5" value="low" onClick={() => setAnswers({ ...answers, "5": [0] })}
                />
                <label htmlFor="degree5">나쁨</label>
              </div>
              <div>
                <input type="radio" id="mid" name="degree5" value="mid"
                  onClick={() => setAnswers({ ...answers, "5": [1] })}
                />
                <label htmlFor="degree5">보통</label>
              </div>
              <div>
                <input type="radio" id="high" name="degree5" value="high" onClick={() => setAnswers({ ...answers, "5": [2] })}
                />
                <label htmlFor="degree5">좋음</label>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <button onClick={() => handleSend()}>제출</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

function EventAnswer({data:totalData}) {
  const user_id = localStorage.getItem('user_id');
  const data = localStorage.getItem('value');
  {/*
  만약 진짜 데이터가 있었다면 숫자 부분에는 다시 axios.get 을 이용한 토탈 데이터의 정보가 들어갑니다.
  */}
  return (
    <>
      <button onClick={() => {
        console.log(user_id);
        console.log(data);
      }}>e</button>
      <h2>설문조사 통계 with.{user_id}</h2>
      <div class='chart'>
        <div>
          <dl>
          <dt>서비스 지향성</dt>
          <dd><strong>7.9%</strong> <em>25</em></dd>
          </dl>
        </div>
        <div>
          <dl>업무 전문성
          <dd><strong>13%</strong> <em>41</em></dd>
          </dl>
        </div>
        <div>
          <dl>능동적 도전성
          <dd><strong>20.9%</strong> <em>66</em></dd>
          </dl>
        </div>
        <div>
          <dl>협업과 커뮤니케이션
          <dd><strong>35.1%</strong> <em>111</em></dd>
          </dl>
        </div>
        <div>
          <dl>긍정 에너지
          <dd><strong>23.1%</strong> <em>73</em></dd>
          </dl>
        </div>
      </div>
    </>
  )
}

export default App;
