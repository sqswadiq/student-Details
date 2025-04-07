import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [edit, setEdit] = useState(null)
  const [students, setstudents] = useState([])
  console.log(students, "students state");

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [course, setCourse] = useState("")
  const [result, setResult] = useState("")
  console.log(name, age, course, result);

  // search
  const [search, setSearch] = useState("")

  // dropdown filter
  const [resultFilter, setResultFilter] = useState("");





  useEffect(() => {
    const storedData = localStorage.getItem("students")
    if (storedData) {
      setstudents(JSON.parse(storedData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students))
  }, [students])
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !age || !course || !result) {
      alert("please enter the Data")
      return
    }

    else {
      const newStudent = {
        id: edit ? edit : Date.now(),
        name,
        age,
        course,
        result,
        feeStatus: "Unpaid" // default to unpaid
      }

      if (edit) {
        // edit
        const editedStudents = students.map((std) => (std.id == edit ? newStudent : std))
        setstudents(editedStudents)
        setEdit(null)
      } else {
        setstudents([...students, newStudent])
      }
      setName("")
      setAge("")
      setCourse("")
      setResult("")


    }
  }
  const handleDelete = (deleteId) => {
    const deletedItem = students.filter((std) => std.id !== deleteId)
    setstudents(deletedItem)
  }
  const handleEdit = (item) => {
    setName(item?.name)
    setAge(item?.age)
    setCourse(item?.course)
    setResult(item?.result)
    setEdit(item?.id)
  }

  const filteredStudents = students.filter((std) => {
    const matchSearch =
      std.name.toLowerCase().includes(search.toLowerCase()) ||
      std.result.toLowerCase().includes(search.toLowerCase())

    const matchFilter =
      resultFilter == "" || std.result.toLowerCase() == resultFilter.toLowerCase()

    return matchSearch && matchFilter
  })
  console.log(filteredStudents, "filtered");

  const handleCheckbox = (checkId) => {
    const updated = students.map((std) =>

      std.id == checkId ? { ...std, feeStatus: std.feeStatus == "Paid" ? "Unpaid" : "Paid" }
        :
        std

    )
    setstudents(updated)
  }
  return (
    <div className='container my-5'>

      <h2 className='text-center my-4 text-decoration-underline text-danger-emphasis'>Student Details</h2>



      <form>
        <div className='d-flex align-items-center flex-column'>
          <input value={name} type="text" onChange={(e) => setName(e.target.value)} className="form-control my-2" placeholder='Enter Name' />
          <input value={age} type="number" onChange={(e) => setAge(e.target.value)} className="form-control my-2" placeholder='Enter Age' />
          <input value={course} type="text" onChange={(e) => setCourse(e.target.value)} className="form-control my-2" placeholder='Enter Course' />
          <input value={result} type="text" onChange={(e) => setResult(e.target.value)} className="form-control my-2" placeholder='Enter Result (pass/fail)' />
  
        </div>
        <div className='d-flex justify-content-center'>
          <button onClick={handleSubmit} className='btn btn-success'>{edit ? "Update" : "Submit"}</button>
        </div>
      </form>

      <div className='d-flex justify-content-center mt-5'>
        <input value={search} onChange={(e) => setSearch(e.target.value)} className='form-control w-50 me-2' type="text" placeholder='Search by name or result' />
        {/* <button className='btn btn-warning'>Search</button> */}
        <select
          className='form-select w-25'
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value)}
        >
          <option value="">All Results</option>
          <option value="pass">Pass</option>
          <option value="fail">Fail</option>
        </select>
      </div>

      <hr className='border border-4 border-secondary' />

      {filteredStudents?.length > 0 ?
        <div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Age</th>
                <th scope="col">Course</th>
                <th scope="col">Result</th>
                <th scope="col">Fee Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody >
              {
                filteredStudents.map((item, index) => (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{item?.name}</td>
                    <td>{item?.age}</td>
                    <td>{item?.course}</td>
                    <td>{item?.result}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={item?.feeStatus === "Paid"}
                        onChange={() => handleCheckbox(item?.id)}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleEdit(item)} className='btn btn-secondary m-2 '>
                      <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => handleDelete(item?.id)} className='btn btn-danger m-2'>
                      <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          {students?.length > 0 &&
            <div className="row">
              <div className="col-md-6">
                <h5 className='text-center'>Fees Paid</h5>

                <table class="table table-info">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Course</th>
                      <th scope="col">Fee Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.filter((std) => std.feeStatus == "Paid").map((item, index) => (

                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{item?.name}</td>
                        <td>{item?.course}</td>
                        <td>{item?.feeStatus}</td>
                      </tr>
                    ))
                    }
                  </tbody>
                </table>


              </div>
              <div className="col-md-6">
                <h5 className='text-center'>Fees UnPaid</h5>

                <table class="table table-danger">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Course</th>
                      <th scope="col">Fee Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.filter((std) => std.feeStatus == "Unpaid").map((item, index) => (

                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{item?.name}</td>
                        <td>{item?.course}</td>
                        <td>{item?.feeStatus}</td>
                      </tr>
                    ))
                    }
                  </tbody>
                </table>


              </div>
            </div>
          }

        </div>
        :
        <div>Nothing to display</div>
      }

    </div>

  )
}

export default App
