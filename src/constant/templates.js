export const templates = [
  {
    "name": "购物",
    "description": "去淘宝买袜子",
    "prompt": "帮我在淘宝买双袜子，加入到购物车",
    "startPage": "https://www.taobao.com/",
    "logo":"assets/quickstart/taobao.webp"
  },
  
  {
    "name": "订酒店",
    "description": "去携程买订酒店",
    "prompt": "我需要去深圳出差，请帮我定一个酒店",
    "startPage": "https://www.ctrip.com/",
    "logo":"assets/quickstart/xiechen.webp"
  },
  // {
  //   "name": "skyvern-Find a product and add it to cart",
  //   "prompt": "Search for the specified product id, add it to cart and then navigate to the cart page. Your goal is COMPLETE when you're on the cart page and the specified product is in the cart. Do not attempt to checkout.{\"product_id\":\"W01-377-8537\"}",
  //   "startPage": "https://www.finditparts.com",
  //   "logo":"assets/quickstart/app.png"
  // }
  // ,
  // {
  //   "name": "skyvern-Geico - generate an insurance quote",
  //   "prompt": "Navigate through the website until you generate an auto insurance quote. Do not generate a home insurance quote. If you're on a page showing an auto insurance quote (with premium amounts), your goal is COMPLETE. here are some my info if you need to fill.{\"licensed_at_age\":19,\"education_level\":\"HIGH_SCHOOL\",\"phone_number\":\"8042221111\",\"full_name\":\"Chris P. Bacon\",\"past_claim\":[],\"has_claims\":false,\"spouse_occupation\":\"Florist\",\"auto_current_carrier\":\"None\",\"home_commercial_uses\":null,\"spouse_full_name\":\"Amy Stake\",\"auto_commercial_uses\":null,\"requires_sr22\":false,\"previous_address_move_date\":null,\"line_of_work\":null,\"spouse_age\":\"1987-12-12\",\"auto_insurance_deadline\":null,\"email\":\"chris.p.bacon@abc.com\",\"net_worth_numeric\":1000000,\"spouse_gender\":\"F\",\"marital_status\":\"married\",\"spouse_licensed_at_age\":20,\"license_number\":\"AAAAAAA090AA\",\"spouse_license_number\":\"AAAAAAA080AA\",\"how_much_can_you_lose\":25000,\"vehicles\":[{\"annual_mileage\":10000,\"commute_mileage\":4000,\"existing_coverages\":null,\"ideal_coverages\":{\"bodily_injury_per_incident_limit\":50000,\"bodily_injury_per_person_limit\":25000,\"collision_deductible\":1000,\"comprehensive_deductible\":1000,\"personal_injury_protection\":null,\"property_damage_per_incident_limit\":null,\"property_damage_per_person_limit\":25000,\"rental_reimbursement_per_incident_limit\":null,\"rental_reimbursement_per_person_limit\":null,\"roadside_assistance_limit\":null,\"underinsured_motorist_bodily_injury_per_incident_limit\":50000,\"underinsured_motorist_bodily_injury_per_person_limit\":25000,\"underinsured_motorist_property_limit\":null},\"ownership\":\"Owned\",\"parked\":\"Garage\",\"purpose\":\"commute\",\"vehicle\":{\"style\":\"AWD 3.0 quattro TDI 4dr Sedan\",\"model\":\"A8 L\",\"price_estimate\":29084,\"year\":2015,\"make\":\"Audi\"},\"vehicle_id\":null,\"vin\":null}],\"additional_drivers\":[],\"home\":[{\"home_ownership\":\"owned\"}],\"spouse_line_of_work\":\"Agriculture, Forestry and Fishing\",\"occupation\":\"Customer Service Representative\",\"id\":null,\"gender\":\"M\",\"credit_check_authorized\":false,\"age\":\"1987-11-11\",\"license_state\":\"Washington\",\"cash_on_hand\":\"$10000–14999\",\"address\":{\"city\":\"HOUSTON\",\"country\":\"US\",\"state\":\"TX\",\"street\":\"9625 GARFIELD AVE.\",\"zip\":\"77082\"},\"spouse_education_level\":\"MASTERS\",\"spouse_email\":\"amy.stake@abc.com\",\"spouse_added_to_auto_policy\":true}",
  //   "startPage": "https://www.geico.com"
  // },
  // {
  //   "name": "skyvern-Apply to a job",
  //   "prompt": "Fill out the job application form and apply to the job. Fill out any public burden questions if they appear in the form. Your goal is complete when the page says you've successfully applied to the job. Terminate if you are unable to apply successfully.{\"name\":\"John Doe\",\"email\":\"0eojybes@example.com\",\"phone\":\"8310486072\",\"resume_url\":\"https://writing.colostate.edu/guides/documents/resume/functionalSample.pdf\",\"cover_letter\":\"Generate a compelling cover letter for me\"}",
  //   "startPage": "https://jobs.lever.co/leverdemo-8/45d39614-464a-4b62-a5cd-8683ce4fb80a/apply"
  // },
  // {
  //   "name": "skyvern-Fill an online enrollment form",
  //   "prompt": "Navigate through the employer services online enrollment form. Terminate when the form is completed.{\"username\":\"isthisreal1\",\"password\":\"Password123!\",\"first_name\":\"John\",\"last_name\":\"Doe\",\"pin\":\"1234\",\"email\":\"isthisreal1@gmail.com\",\"phone_number\":\"412-444-1234\"}",
  //   "startPage": "https://eddservices.edd.ca.gov/acctservices/AccountManagement/AccountServlet?Command=NEW_SIGN_UP"
  // },
  // {
  //   "name": "skyvern-Fill a contact us form",
  //   "prompt": "Fill out the contact us form and submit it. Your goal is complete when the page says your message has been sent.{\"username\":\"isthisreal1\",\"password\":\"Password123!\",\"first_name\":\"John\",\"last_name\":\"Doe\",\"pin\":\"1234\",\"email\":\"isthisreal1@gmail.com\",\"phone_number\":\"412-444-1234\"}",
  //   "startPage": "https://canadahvac.com/contact-hvac-canada/"
  // }
  // ,
  // {
  //   "name": "skyvern-Generate an auto insurance quote",
  //   "prompt": "Generate an auto insurance quote. A quote has been generated when there's a table of coverages shown on the website.",
  //   "startPage": "https://www.bciseguros.cl/nuestros_seguros/personas/seguro-automotriz/"
  // },
  // {
  //   "name": "skyvern-Get the top post on Hackernews",
  //   "prompt": "Navigate to the Hacker News homepage and identify the top post. COMPLETE when the title and URL of the top post are extracted. Ensure that the top post is the first post listed on the page.",
  //   "startPage": "https://news.ycombinator.com"
  // },
  // {
  //   "name": "skyvern-Get the stock price of AAPL",
  //   "prompt": "Navigate to the search bar on Google Finance, type 'AAPL', and press Enter. COMPLETE when the search results for AAPL are displayed and the stock price is extracted.",
  //   "startPage": "https://www.google.com/finance"
  // },
  // {
  //   "name": "skyvern-Get the top NYT bestseller",
  //   "prompt": "Navigate to the NYT Bestsellers page and identify the top book listed. COMPLETE when the title and author of the top book are identified.",
  //   "startPage": "https://www.nytimes.com/books/best-sellers"
  // },
  // {
  //   "name": "skyvern-Get the top ranked football team",
  //   "prompt": "Navigate to the FIFA World Ranking page and identify the top ranked football team. COMPLETE when the name of the top ranked football team is found and displayed.",
  //   "startPage": "https://www.fifa.com/fifa-world-ranking/"
  // }
]
