const RB = ReactBootstrap;
const { Alert, Card, Button, Table, Form, Container, Row, Col, Image } =
  ReactBootstrap;

const firebaseConfig = {
  apiKey: "AIzaSyAXPvgUlVYdGbWVOpOjREkH0fIhF1j5XEk",
  authDomain: "web2568-ebf9e.firebaseapp.com",
  projectId: "web2568-ebf9e",
  storageBucket: "web2568-ebf9e.firebasestorage.app",
  messagingSenderId: "829257158327",
  appId: "1:829257158327:web:aa8f483bfcf318161e4732",
  measurementId: "G-5D8KG9Y2J1",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

class App extends React.Component {
  state = {
    students: [],
    stdid: "",
    stdtitle: "",
    stdfname: "",
    stdlname: "",
    stdemail: "",
    stdphone: "",
    user: null,
  };

  constructor() {
    super();
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user: user ? user.toJSON() : null });
    });
  }

  google_login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    firebase.auth().signInWithPopup(provider);
  }

  google_logout() {
    if (confirm("Are you sure?")) {
      firebase.auth().signOut();
    }
  }

  readData() {
    db.collection("students")
      .get()
      .then((querySnapshot) => {
        var stdlist = [];
        querySnapshot.forEach((doc) => {
          stdlist.push({ id: doc.id, ...doc.data() });
        });
        this.setState({ students: stdlist });
      });
  }

  autoRead() {
    db.collection("students").onSnapshot((querySnapshot) => {
      var stdlist = [];
      querySnapshot.forEach((doc) => {
        stdlist.push({ id: doc.id, ...doc.data() });
      });
      this.setState({ students: stdlist });
    });
  }

  insertData() {
    db.collection("students")
      .doc(this.state.stdid)
      .set({
        title: this.state.stdtitle,
        fname: this.state.stdfname,
        lname: this.state.stdlname,
        phone: this.state.stdphone,
        email: this.state.stdemail,
      })
      .then(() => {
        this.setState({
          stdid: "",
          stdtitle: "",
          stdfname: "",
          stdlname: "",
          stdemail: "",
          stdphone: "",
        });
        this.readData();
      });
  }

  edit(std) {
    this.setState(
      {
        stdid: std.id,
        stdtitle: std.title,
        stdfname: std.fname,
        stdlname: std.lname,
        stdemail: std.email,
        stdphone: std.phone,
      },
      () => this.readData()
    );
  }

  delete(std) {
    if (confirm("ต้องการลบข้อมูล")) {
      db.collection("students")
        .doc(std.id)
        .delete()
        .then(() => this.readData());
    }
  }

  render() {
    return (
      <Container className="p-4">
        <Card>
          <Card.Header as="h5" className="bg-info text-white text-center">
            Work6 : Firebase
          </Card.Header>
          <Card.Body>
            <LoginBox user={this.state.user} app={this} />
            <div className="my-3">
              <Button
                variant="primary"
                className="me-2"
                onClick={() => this.readData()}
              >
                Read Data
              </Button>
              <Button variant="secondary" onClick={() => this.autoRead()}>
                Auto Read
              </Button>
            </div>
            <StudentTable data={this.state.students} app={this} />
            <StudentForm app={this} />
          </Card.Body>
          <Card.Footer className="text-center">
            By 653380144-8 นางสาวเพ็ชชภา นูทอง College of Computing, KKU
          </Card.Footer>
        </Card>
      </Container>
    );
  }
}

function StudentTable({ data, app }) {
  return (
    <Table striped bordered hover>
      <thead className="bg-light">
        <tr>
          <th>ID</th>
          <th>คำนำหน้า</th>
          <th>ชื่อ</th>
          <th>สกุล</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((s) => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.title}</td>
            <td>{s.fname}</td>
            <td>{s.lname}</td>
            <td>{s.email}</td>
            <td>{s.phone}</td>
            <td>
              <Button
                variant="warning"
                size="sm"
                onClick={() => app.edit(s)}
                className="me-2"
              >
                แก้ไข
              </Button>
              <Button variant="danger" size="sm" onClick={() => app.delete(s)}>
                ลบ
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function StudentForm({ app }) {
  return (
    <Form>
      <Row className="mt-2">
        <Col>
          <Form.Control
            placeholder="ID"
            value={app.state.stdid}
            onChange={(e) => app.setState({ stdid: e.target.value })}
          />
        </Col>
        <Col>
          <Form.Control
            placeholder="คำนำหน้า"
            value={app.state.stdtitle}
            onChange={(e) => app.setState({ stdtitle: e.target.value })}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Form.Control
            placeholder="ชื่อ"
            value={app.state.stdfname}
            onChange={(e) => app.setState({ stdfname: e.target.value })}
          />
        </Col>
        <Col>
          <Form.Control
            placeholder="สกุล"
            value={app.state.stdlname}
            onChange={(e) => app.setState({ stdlname: e.target.value })}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Form.Control
            type="email"
            placeholder="Email"
            value={app.state.stdemail}
            onChange={(e) => app.setState({ stdemail: e.target.value })}
          />
        </Col>
        <Col>
          <Form.Control
            placeholder="Phone"
            value={app.state.stdphone}
            onChange={(e) => app.setState({ stdphone: e.target.value })}
          />
        </Col>
      </Row>
      <Button
        variant="success"
        className="mt-3"
        onClick={() => app.insertData()}
      >
        บันทึกข้อมูล
      </Button>
    </Form>
  );
}

function LoginBox({ user, app }) {
  return user ? (
    <div className="text-center">
      <Image src={user.photoURL} roundedCircle width={50} className="me-2" />
      {user.email}{" "}
      <Button variant="danger" size="sm" onClick={() => app.google_logout()}>
        Logout
      </Button>
    </div>
  ) : (
    <Button variant="primary" onClick={() => app.google_login()}>
      Login with Google
    </Button>
  );
}

const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);
