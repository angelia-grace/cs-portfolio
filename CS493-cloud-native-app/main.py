from flask import Flask, request, jsonify
from google.cloud import datastore

import requests
import json

from six.moves.urllib.request import urlopen
from jose import jwt
from authlib.integrations.flask_client import OAuth

app = Flask(__name__)
app.secret_key = "redacted"

client = datastore.Client()

COURSES = "courses"
USERS = "users"

# Update the values of the following 3 variables
CLIENT_ID = "redacted"
CLIENT_SECRET = "redacted"
DOMAIN = "redacted"

ALGORITHMS = ["RS256"]

oauth = OAuth(app)

auth0 = oauth.register(
    'auth0',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    api_base_url="https://" + DOMAIN,
    access_token_url="https://" + DOMAIN + "/oauth/token",
    authorize_url="https://" + DOMAIN + "/authorize",
    client_kwargs={
        'scope': 'openid profile email',
    },
)


# This code is adapted from https://auth0.com/docs/quickstart/backend/python/01-authorization?_ga=2.46956069.349333901.1589042886-466012638.1589042885#create-the-jwt-validation-decorator


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


# Verify the JWT in the request's Authorization header
def verify_jwt(request):
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization'].split()
        token = auth_header[1]
    else:
        raise AuthError({"code": "no auth header",
                         "description":
                             "Authorization header is missing"}, 401)

    jsonurl = urlopen("https://" + DOMAIN + "/.well-known/jwks.json")
    jwks = json.loads(jsonurl.read())
    try:
        unverified_header = jwt.get_unverified_header(token)
    except jwt.JWTError:
        raise AuthError({"code": "invalid_header",
                         "description":
                             "Invalid header. "
                             "Use an RS256 signed JWT Access Token"}, 401)
    if unverified_header["alg"] == "HS256":
        raise AuthError({"code": "invalid_header",
                         "description":
                             "Invalid header. "
                             "Use an RS256 signed JWT Access Token"}, 401)
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }
    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=CLIENT_ID,
                issuer="https://" + DOMAIN + "/"
            )
        except jwt.ExpiredSignatureError:
            raise AuthError({"code": "token_expired",
                             "description": "token is expired"}, 401)
        except jwt.JWTClaimsError:
            raise AuthError({"code": "invalid_claims",
                             "description":
                                 "incorrect claims,"
                                 " please check the audience and issuer"}, 401)
        except Exception:
            raise AuthError({"code": "invalid_header",
                             "description":
                                 "Unable to parse authentication"
                                 " token."}, 401)

        return payload
    else:
        raise AuthError({"code": "no_rsa_key",
                         "description":
                             "No RSA key in JWKS"}, 401)


@app.route('/')
def index():
    return "Please navigate to /courses to use this API" \
 \
        # Create a course if the Authorization header contains a valid JWT


# ------------------------------------------ COURSES --------------------------------------------


# ENDPOINT 7. CREATE A COURSE
@app.route('/courses', methods=['POST'])
def course_post():
    if request.method == 'POST':

        # ------------------------ VERIFY ------------------------
        try:
            payload = verify_jwt(request)
            verify_query = client.query(kind='users')
            verify_query.add_filter('sub', '=', payload['sub'])
        except AuthError:
            return ({"Error": "Unauthorized"}, 401)
        user = list(verify_query.fetch())[0]
        if user["role"] != "admin":
            return ({"Error": "You don't have permission on this resource"}, 403)
        # --------------------------------------------------------

        content = request.get_json()
        if 'subject' not in content or 'number' not in content or 'title' not in content or 'term' not in content or 'instructor_id' not in content:
            # missing required attributes
            return {'Error': 'The request body is invalid'}, 400
        instructor = client.get(key=client.key('users', content['instructor_id']))
        if instructor is None or instructor["role"] != "instructor":
            # invalid instructor id
            return {'Error': 'The request body is invalid'}, 400

        new_course = datastore.entity.Entity(key=client.key(COURSES))
        new_course.update(
            {
                'subject': content['subject'],
                'number': content['number'],
                'title': content['title'],
                'term': content['term'],
                'instructor_id': content['instructor_id'],
                'enrollment': []
            }
        )
        client.put(new_course)
        new_course['id'] = new_course.key.id
        new_course.update({
            'self': f"https://marticad-proj4.uc.r.appspot.com/courses/{new_course.key.id}"
        })
        client.put(new_course)
        return (new_course, 201)
    else:
        return jsonify(error='Method not recogonized')


# ENDPOINT 10. UPDATE A COURSE
@app.route('/courses' + '/<int:id>', methods=['PATCH'])
def course_patch(id):

    course_key = client.key('courses', id)
    course = client.get(key=course_key)
    if course is None:
        return {"Error": "Not found"}, 404

    # ------------------------ VERIFY ------------------------
    try:
        payload = verify_jwt(request)
        verify_query = client.query(kind='users')
        verify_query.add_filter('sub', '=', payload['sub'])
    except AuthError:
        return ({"Error": "Unauthorized"}, 401)
    user = list(verify_query.fetch())[0]
    if user["role"] != "admin":
        return ({"Error": "You don't have permission on this resource"}, 403)
    # --------------------------------------------------------

    content = request.get_json()

    if "instructor_id" in content:
        instructor = client.get(key=client.key('users', content['instructor_id']))
        if instructor is None or instructor["role"] != "instructor":
            # invalid instructor id
            return {'Error': 'The request body is invalid'}, 400
        else:
            # valid instructor id, update course
            course.update({"instructor_id": content["instructor_id"]})

    if "subject" in content:
        course.update({"subject": content["subject"]})

    if "number" in content:
        course.update({"number": content["number"]})

    if "title" in content:
        course.update({"title": content["title"]})

    if "term" in content:
        course.update({"term": content["term"]})

    client.put(course)

    course.pop("enrollment")
    return (course, 200)


# ENDPOINT 8. GET ALL COURSES
@app.route('/courses', methods=['GET'])
def get_courses():
    # GET
    query = client.query(kind='courses')
    page_limit = 3
    page_offset = int(request.args.get('offset', '0'))
    courses_list = query.fetch(limit=page_limit, offset=page_offset)

    # PAGINATE
    pages = courses_list.pages
    paged_results = list(next(pages))
    for course in paged_results:
        course['id'] = course.key.id
        course.pop('enrollment')
    if courses_list.next_page_token:
        new_offset = page_offset + page_limit
        next_url = request.base_url + f"?limit=3&offset={new_offset}"
    else:
        next_url = None
    output = {"courses": paged_results}
    if next_url:
        output["next"] = next_url

    # RETURN
    return (json.dumps(output), 200, {'Content-Type': 'application/json'})


# ENDPOINT 9. GET A COURSE
@app.route('/courses' + '/<int:id>', methods=['GET'])
def get_course(id):
    course_key = client.key('courses', id)
    course = client.get(key=course_key)
    if course is None:
        return {"Error" : "Not found"}, 404
    else:
        course['id'] = course.key.id
        course.pop('enrollment')
        return course


# ENDPOINT 11. DELETE A COURSE
@app.route('/courses' + '/<int:id>', methods=['DELETE'])
def delete_course(id):
    course_key = client.key('courses', id)
    course = client.get(key=course_key)

    # ------------------------ VERIFY ------------------------
    try:
        payload = verify_jwt(request)
        verify_query = client.query(kind='users')
        verify_query.add_filter('sub', '=', payload['sub'])
    except AuthError:
        return ({"Error": "Unauthorized"}, 401)
    user = list(verify_query.fetch())[0]
    if user["role"] != "admin":
        return ({"Error": "You don't have permission on this resource"}, 403)
    # --------------------------------------------------------

    client.delete(course_key)
    return ('', 204)


# ------------------------------------------- USERS ---------------------------------------------

# ENDPOINT 2. GET ALL USERS
@app.route('/users', methods=['GET'])
def get_users():

    # ------------------------ VERIFY ------------------------
    try:
        payload = verify_jwt(request)
        verify_query = client.query(kind='users')
        verify_query.add_filter('sub', '=', payload['sub'])
    except AuthError:
        return ({"Error": "Unauthorized"}, 401)
    user = list(verify_query.fetch())[0]
    if user["role"] != "admin":
        return ({"Error": "You don't have permission on this resource"}, 403)
    # --------------------------------------------------------

    all_users_query = client.query(kind='users')
    results_list = list(all_users_query.fetch())
    for result in results_list:
        result['id'] = result.key.id
    return results_list


# ENDPOINT 3. GET A USER
@app.route('/users' + '/<int:id>', methods=['GET'])
def get_user(id):

    # ------------------------ VERIFY ------------------------
    try:
        payload = verify_jwt(request)
        verify_query = client.query(kind='users')
        verify_query.add_filter('sub', '=', payload['sub'])
    except AuthError:
        return ({"Error": "Unauthorized"}, 401)
    user = list(verify_query.fetch())[0]
    if user["role"] != "admin" and user.key.id != id:
        return ({"Error": "You don't have permission on this resource"}, 403)
    # --------------------------------------------------------

    user_key = client.key('users', id)
    user_return = client.get(key=user_key)

    # instructor courses
    if user_return["role"] == "instructor":
        course_query = client.query(kind="courses")
        course_query.add_filter("instructor_id", '=', id)
        user_return["courses"] = list(course_query.fetch())

    # student courses
    elif user_return["role"] == "student":
        course_query = client.query(kind="courses")
        courses_list = list(course_query.fetch())
        user_return["courses"] = []
        for course in courses_list:
            if id in course["enrollment"]:
                user_return["courses"].append(course.key.id)

    return (user_return, 200)


# ---------------------------------------- ENROLLMENT ------------------------------------------


# ENDPOINT 13. GET ENROLLMENT OF A COURSE
@app.route('/courses' + '/<int:id>' + '/students', methods=['GET'])
def get_course_enroll(id):

    course_key = client.key('courses', id)
    course = client.get(key=course_key)

    if course is None:
        return {"Error" : "No course with this course_id exists"}, 403

    # ------------------------ VERIFY ------------------------
    try:
        payload = verify_jwt(request)
        verify_query = client.query(kind='users')
        verify_query.add_filter('sub', '=', payload['sub'])
    except AuthError:
        return ({"Error": "Unauthorized"}, 401)
    user = list(verify_query.fetch())[0]
    if user["role"] != "admin" and user.key.id != course["instructor_id"]:
        return ({"Error": "You don't have permission on this resource"}, 403)
    # --------------------------------------------------------

    return (200, course["enrollment"])


# ENDPOINT 12. UPDATE ENROLLMENT OF A COURSE
@app.route('/courses' + '/<int:id>' + '/students', methods=['PATCH'])
def patch_course_enroll(id):

    course_key = client.key('courses', id)
    course = client.get(key=course_key)
    if course is None:
        return {"Error" : "No course with this course_id exists"}, 403

    # ------------------------ VERIFY ------------------------
    try:
        payload = verify_jwt(request)
        verify_query = client.query(kind='users')
        verify_query.add_filter('sub', '=', payload['sub'])
    except AuthError:
        return ({"Error": "Unauthorized"}, 401)
    user = list(verify_query.fetch())[0]
    if user["role"] != "admin" and user.key.id != course["instructor_id"]:
        return ({"Error": "You don't have permission on this resource"}, 403)
    # --------------------------------------------------------

    content = request.get_json()
    old_enrollment = course["enrollment"]
    new_enrollment = []
    for student in old_enrollment:
        new_enrollment.append(student)

    if any(student in content["add"] for student in content["remove"]):
        return (409, {"Error": "Enrollment data is invalid"})

    if "add" in content:
        new_students = content["add"]
        for student in new_students:
            if student not in new_enrollment:
                new_enrollment.append(student)
    if "remove" in content:
        dropped_students = content["remove"]
        for student in dropped_students:
            if student in new_enrollment:
                new_enrollment.remove(student)

    course.update({"enrollment": new_enrollment})
    client.put(course)

    return (" ", 200)


# ----------------------------------------------------------------------------------------------


# Decode the JWT supplied in the Authorization header
@app.route('/decode', methods=['GET'])
def decode_jwt():
    payload = verify_jwt(request)
    return payload


# Generate a JWT from the Auth0 domain and return it
# Request: JSON body with 2 properties with "username" and "password"
#       of a user registered with this Auth0 domain
# Response: JSON with the JWT as the value of the property id_token
@app.route('/users/login', methods=['POST'])
def login_user():
    content = request.get_json()
    if "username" not in content or "password" not in content:
        return (400, {"Error": "The request body is invalid"})
    username = content["username"]
    password = content["password"]
    body = {'grant_type': 'password', 'username': username,
            'password': password,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
            }
    headers = {'content-type': 'application/json'}
    url = 'https://' + DOMAIN + '/oauth/token'
    r = requests.post(url, json=body, headers=headers)
    return {"token": json.loads(r.text)["id_token"]}, 200, {'Content-Type': 'application/json'}


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)

