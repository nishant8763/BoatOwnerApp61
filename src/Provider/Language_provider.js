import { Alert, ToastAndroid, I18nManager, Platform } from "react-native";
import { localStorage } from './localStorageProvider';
import AsyncStorage from "@react-native-community/async-storage";
import { config } from "./configProvider";

global.language_key = 1;
class Language_provider {

  language_get = async () => {

    var item = await AsyncStorage.getItem('language');
    console.log('check launguage option', item)

    if (item != null) {
      console.log('kya bat h vikas bhai', config.language)
      config.language = item;
    }

    console.log('language_key123', config.language)
  }
  language_set = (value) => {
    config.language = value;
    localStorage.setItemObject('language', value)
  }
  // inbox//
  tittleinbox = ['Inbox', "صندوق الوارد"]
  //chat //
  chattextinputmessage = ['Message', "رسالة "]
  chataction = ['Action', "عمل "]
  chatreport = ['Report User', "الابلاغ عن المستخدم "]
  chatclear = ['Clear Chat', "مسح المحادثة "]
  chatcancel = ['Cancel', "الغاء "]
  reportmessagepopup = ['Are your sure you want to ? report', "هل ترغب فعلا ؟ تبليغ "]
  chatclearpopup = ['Are your sure you want to ? clear chat', "هل ترغب فعلا ؟ مسح المحادثة "]
  emptyFirstName = ['Please enter first name', 'الرجاء ادخال الاسم الاول ']
  FirstNameMinLength = ['First name must be of minimum 3 characters', 'يجب ان لا يقل الاسم الاول عن 3 احرف ']
  FirstNameMaxLength = ['First name cannot be more than 50 characters', 'يجب ان لا يزيد الاسم الاول عن 50 حرف ']
  validFirstName = ['Enter valid first name', 'الرجاء ادخال اسم صحيح ']
  //acount_holder name=========
  emptyholder_name = ['Please enter bank holder name', 'الرجاء ادخال اسم البنك ']
  holder_nameMinLength = ['Bank holder name must be of minimum 3 characters', 'يجب ان لا يقل اسم البنك عن 3 احرف ']
  holder_nameMaxLength = ['Bank holder name cannot be more than 50 characters', 'يجب ان لا يزيد اسم البنك عن 50 حرف ']
  validholder_name = ['Enter valid bank holder name', 'ادخل اسم بنك صحيح ']
  //Bank name=========
  emptyBank_name = ['Please enter bank name','الرجاء إدخال اسم البنك']
  BanknameMinLength = ['Bank name must be of minimum 3 characters', 'يجب ألا يقل اسم البنك عن 3 أحرف']
  //ifsc  name=========
  emptyifscNo = ['Please enter IBAN number', 'الرجاء ادخال رقم الأيبان ']
  ifscNoMinLength = ['IBAN number must be of minimum 3 characters', 'يجب ان لا يقل رقم الأيبان عن 3 ارقام ']
  ifscNoMaxLength = ['IBAN number cannot be more than 20 characters.', 'يجب ان لا يزيد رقم الأيبان عن 20 رقم ']

  emptyAccNo = ['Please enter account number', 'الرجاء ادخال رقم الحساب ']
  AccNoMinLength = ['Account number must be of minimum 3 characters', 'يجب ان لا يقل رقم الحساب عن 3 ارقام ']
  AccNoMaxLength = ['Account number cannot be more than 20 characters', 'يجب ان لا يزيد رقم الحساب عن 20 رقم ']
  AccNoVailidLength = ['Account number should be only digit.', 'رقم الحساب يتكون من ارقام فقط ']
  //amount==========
  emptyAmount = ['Please enter amount', 'الرجاء ادخال المبلغ ']
  vailidAmount = ['Please enter amount', 'الرجاء ادخال المبلغ ']

  // last name====================
  emptyLastName = ['Please enter last name', 'الرجاء ادخال الاسم الاخير ']
  LastNameMinLength = ['Last name must be of minimum 3 characters', 'يجب ان لا يقل الاسم الاخير عن 3 احرف ']
  LastNameMaxLength = ['Last name cannot be more than 50 characters', 'يجب ان لا يزيد الاسم الاخير عن 50 حرف ']
  validLastName = ['Enter valid last name', 'ادخل اسم اخير صحيح ']
  // BUSINESS name====================
  BussinessEmptyName = ['Please enter bussiness name', 'الرجاء ادخال الاسم التجاري ']
  BussinessNameMinLength = ['Bussiness name must be of minimum 3 characters', 'يجب ان لا يقل الاسم التجاري عن 3 احرف ']
  BussinessNameMaxLength = ['Bussiness name cannot be more than 50 characters', 'يجب ان لا يزيد الاسم التجاري عن 50 حرف ']
  BussinessValidName = ['Enter valid Bussiness name', 'ادخل اسم تجاري صحيح ']
  //name====================
  EmptyName = ['Please enter bussiness name', 'الرجاء ادخال الاسم التجاري ']
  NameMinLength = ['Name must be of minimum 3 characters', 'يجب ان لا يقل الاسم عن 3 احرف ']
  NameMaxLength = ['Name cannot be more than 50 characters', 'يجب ان لا يزيد الاسم عن 50 حرف ']
  // BUSINESS location====================
  businessLocationempty = ['Please enter business location', 'االرجاء ادخال الموقع التجاري ']
  //email============================
  emptyEmail = ["Please enter email address", "الرجاء ادخال عنوان البريد الالكتروني "]
  emailMaxLength = ['Email address cannot be more than 50 characters', 'يجب ان لا يزيد عنوان البريد الالكتروني عن 50 حرف ']
  validEmail = ["Please enter valid email address", "ادخل عنوان بريد الكتروني صحيح "]
  //city============
  emptyCity = ['Please select city', "الرجاء اختيار المدينة "]
  //DOB============
  emptydob = ['Please select date of birth', "الرجاء ادخال تاريخ الميلاد "]
  emptydate = ['Please select date', "الرجاء اختيار اليوم "]
  emptytime = ['Please select time', "الرجاء اختيار الوقت "]
  //DOB============data_not_found
  emptygender = ['Please select gender', "الرجاء اختيار الجنس "]

  //password=========================
  emptyPassword = ['Please enter password', 'الرجاء ادخال كلمة مرور ']
  PasswordMinLength = ['Password must be of minimum 6 characters', 'يجب ان لا تقل كلمة المرور عن 6 احرف ']
  PasswordMaxLength = ['Password cannot be more than 16 characters', "يجب ان لا تزيد كلمة المرور عن 16 حرف "]
  //cpassword=====================
  // For Confirm Password
  emptyConfirmPWD = ['Please confirm your password', "الرجاء تأكيد كلمة المرور "]
  ConfirmPWDMatch = ['Password does not match', "كلمة المرور غير مطابقة "]
  ConfirmPWDMinLength = ['Confirm password must be of minimum 6 characters', "يجب ان لا يقل تأكيد كلمة المرور عن 6 احرف "]
  ConfirmPWDMaxLength = ['Confirm password cannot be more than 16 characters', "يجب ان لا يزيد تأكيد كلمة المرور عن 16 حرف "]

  //phone no===============
  emptyMobile = ["Please enter mobile number", "الرجاء ادخال رقم الهاتف المحمول "]
  MobileMinLength = ['Mobile number must be of minimum 8 digits', "يجب ان لا يقل رقم الهاتف المحمول عن 8 ارقام "]
  MobileMaxLength = ['Mobile number cannot be more than 8 digits', 'يجب ان لا يزيد رقم الهاتف المحمول عن 8 ارقام ']
  validMobile = ["Please enter valid mobile number ", "الرجاء ادخال رقم هاتف محمول صحيح "]
  //contact no===============
  emptyMobile1 = ["Please enter contact number", "الرجاء ادخال رقم الاتصال "]
  MobileMinLength1 = ['Contact number must be of minimum 8 digits', "يجب ان لا يقل رقم الاتصال عن 8 ارقام "]
  MobileMaxLength1 = ['Contact number cannot be more than 8 digits', 'ييجب ان لا يزيد رقم الاتصال عن 8 ارقام ']
  validMobile1 = ["Please enter valid contact number ", "الرجاء ادخال رقم اتصال صحيح "]
  //boat add=============
  //boat name=====
  emptyBoatName = ['Please enter boat name', 'الرجاء ادخال اسم القارب ']
  BoatNameMinLength = ['Boat name must be of minimum 3 characters', 'يجب ان لا يقل اسم القارب عن 3 احرف ']
  BoatNameMaxLength = ['Boat name cannot be more than 50 characters', 'يجب ان لا يزيد اسم القارب عن 50 حرف ']
  //boat number ================
  emptyBoatNumber = ['Please enter boat number', 'الرجاء ادخال رقم القارب ']
  vailidBoatNumber = ['Boat number should be only digit', 'يجب ان يتكون رقم القارب من ارقام فقط ']
  BoatNumberMinLength = ['Boat Number must be of minimum 3 characters', 'يجب ان لا يقل رقم القارب عن 3 ارقام ']
  BoatNumberMaxLength = ['Boat Number cannot be more than 50 characters', 'يجب ان لا يزيد رقم القارب عن 50 رقم ']
  //boat registration_no ================
  emptyBoatRegistration_no = ['Please enter registration number', 'الرجاء ادخال رقم تسجيل القارب ']
  BoatRegistration_noMinLength = ['Registration number must be of minimum 3 characters', 'يجب ان لا يقل رقم تسجيل القارب عن 3 ارقام ']
  Boatregistration_noMaxLength = ['Registration number cannot be more than 50 characters', 'يجب ان لا يزيد رقم القارب عن 50 رقم ']
  //boat year===============
  emptyBoatYear = ['Please enter boat year', 'الرجاء ادخال سنة صنع القارب ']
  //boat length===============
  emptyBoatLength = ['Please enter boat length', 'الرجاء ادخال حجم القارب ']
  vailidBoatLength = ['Boat length should be only digit', 'يجب ادخال ارقام فقط في خانة حجم القارب ']
  //boat capacity===============
  emptyBoatCapacity = ['Please enter boat capacity', 'الرجاء ادخال العدد الاقصى لركاب القارب ']
  vailidCapacity = ['Capacity  should be only digit', 'يجب ادخال ارقام فقط في خانة عدد ركاب القارب ']
  //boat cabins===============
  emptyBoatCabins = ['Please enter no of cabins', 'الرجاء ادخال عدد الغرف ']
  vailidCabins = ['Cabins  should be only digit', 'يجب ادخال ارقام فقط في خانة عدد الغرف ']
  //boat toilets===============
  emptyBoatToilets = ['Please enter no of toilets', 'الرجاء ادخال عدد دورات المياه ']
  vailidToilets = ['Toilets  should be only digit', 'يجب ادخال ارقام فقط في خانة دورات المياه ']
  // For old Password
  emptyoldPassword = ['Please enter old password', 'Please enter new password', 'Please enter new password', 'الرجاء ادخال كلمة المرور القديمة ', 'الرجاء ادخال كلمة المرور الجديدة ', 'الرجاء ادخال كلمة المرور الجديدة ']
  PasswordoldMinLength = ['Old password must be of minimum 6 characters', 'يجب ان لا تقل كلمة المرور القديمة عن 6 احرف ']
  PasswordoldMaxLength = ['Old password cannot be more than 16 characters', 'يجب ان لا تزيد كلمة المرور القديمة عن 16 حرف ']
  // For New Password
  emptyNewPassword = ['Please enter new password', 'الرجاء ادخال كلمة المرور الجديدة ']
  PasswordNewMinLength = ['New password must be of minimum 6 characters', 'يجب ان لا تقل كلمة المرور الجديدة عن 6 احرف ']
  PasswordNewMaxLength = ['New password cannot be more than 16 characters', 'يجب ان لا تزيد كلمة المرور الجديدة عن 16 حرف ']
  // For Confirm Password
  emptyConfirmPWD = ['Please confirm your password', 'الرجاء تأكيد كلمة المرور ']
  ConfirmPWDMatch = ['Password does not match', 'كلمة المرور غير مطابقة ']
  ConfirmPWDMinLength = ['Confirm password must be of minimum 6 characters', 'يجب ان لا تقل تأكيد كلمة المرور عن 6 احرف ']
  ConfirmPWDMaxLength = ['Confirm password cannot be more than 16 characters', 'يجب ان لا تزيد تأكيد كلمة المرور عن 16 حرف ']
  //Message====
  emptyMessage = ['Please enter message text', "الرجاء ادخال رسالة "]
  maxlenMessage = ['Message cannot be more than 250 characters', "يجب ان لا تزيد الرسالة عن 250 حرف "]
  minlenMessage = ['Message must be of minimum 3 characters', "يجب ان لا تقل الرسالة عن 3 احرف "]
  //---------------------------share app page---------------------------//
  headdingshare = ['I’ve shared a link with you to a great new App', 'لقد تم مشاركتك رابط تطبيق مميز ']
  sharelinktitle = ['MyBoat App Link', 'رابط تطبيق MyBoat ']

  //add ader============================
  emptyArTitle = ['Please enter arabic title', 'الرجاء ادخال العنوان بالعربي ']
  minArTitle = ['Arabic title must be of minimum 3 characters', 'يجب ان لا يقل العنوان العربي عن 3 احرف ']
  maxArTitle = ['Arabic title cannot be more than 50 characters', 'يجب ان لا يزيد العنوان العربي عن 50 حرف ']

  emptyEngTitle = ['Please enter english title', 'الرجاء ادخال العنوان الانجليزي ']
  minEngTitle = ['English title must be of minimum 3 characters', 'يجب ان لا يقل العنوان الانجليزي عن 3 احرف ']
  maxEngTitle = ['English title cannot be more than 50 characters', 'يجب ان لا يزيد العنوان الانجليزي عن 50 حرف ']

  emptyTripType = ['Please select trip type', 'الرجاء اختيار نوع الرحلة ']
  emptyBoatType = ['Please select boat', 'الرجاء اختيار القارب ']
  emptyno_of_people = ['Please enter number of people', 'الرجاء ادخال عدد الافراد ']
  vailidno_of_people = ['Please insert English numbers in how many geust', 'الرجاء ادخال الارقام بالانجليزي في خانة كم عدد الركاب']
  emptyplaceofboat = ['Please select place of boat', 'الرجاء اختيار موقع القارب ']

  emptyArDes = ['Please enter arabic description', "'الرجاء ادخال الوصف بالعربي "]
  maxlenArDes = ['Arabic description cannot be more than 250 characters', "يجب ان لا يزيد الوصف بالعربي عن 250 حرف "]
  minlenArDes = ['Arabic description must be of minimum 3 characters', "يجب ان لا يقل الوصف بالعربي عن 3 احرف "]

  emptyDes = ["Please enter comment", "الرجاء ادخال تعليق "]
  maxlenDes = [' Comment cannot be more than 250 characters', " يجب ان لا يزيد التعليق عن 250 حرف "]
  minlenDes = [' Comment must be of minimum 3 characters.', " يجب ان لا يقل التعليق عن 3 احرف "]

  emptyEngDes = ['Please enter english description', "'الرجاء ادخال الوصف بالانجليزي "]
  maxlenEngDes = ['English description cannot be more than 250 characters', "يجب ان لا يزيد الوصف بالانجليزي عن 250 حرف "]
  minlenEngDes = ['English description must be of minimum 3 characters', "يجب ان لا يقل الوصف بالانجليزي عن 3 احرف "]

  EmptyrentalPrice = ['Please enter rental price', "الرجاء ادخال سعر الحجز "]
  vailidrentalPrice = ['Please enter vailid rental price', "الرجاء ادخال سعر حجز صحيح "]

  EmptyextraPrice = ['Please enter extra price', "الرجاء ادخال سعر الساعة الاضافية "]
  vailidextraPrice = ['Please enter vailid extra price', "الرجاء ادخال سعر ساعة اضافية صحيح "]
  emptyminimumhours = ['Please select minimum hours', "الرجاء اختيار الحد الادنى للساعات "]
  emptyidelhours = ['Please select idle hours', "الرجاء اختيار ساعات الصيانة "]
  emptydescount = ['Please enter discount', "الرجاء اختيار الخصم "]
  vailiddescount = ['Please enter vailid discount', "الرجاء اختيار خصم صحيح "]

  // inbox//
  tittleinbox = ['Message', 'رسالة ']
  //chat //
  chattextinputmessage = ['Message', 'رسالة ']
  chataction = ['Action', 'عمل ']
  chatreport = ['Report User', 'ابلاغ عن مستخدم ']
  chatclear = ['Clear Chat', 'مسح المحادثة ']
  chatcancel = ['Cancel', 'الغاء ']
  reportmessagepopup = ['Are your sure you want to ? report', 'هل تريد فعلا ؟ ابلاغ ']
  chatclearpopup = ['Are your sure you to ? clear chat', 'هل تريد فعلا ؟ مسح المحادثة ']

  //==========================Confirmation Messages=============================
  cancel = ['Cancel', 'الغاء']
  Yes = ['Yes', 'نعم ']
  No = ['No', 'لا ']
  ok = ['Ok', 'حسنا ']
  save = ['Save', 'حفظ ']
  Done = ['Done', 'تم العمل ']
  Confirm = ["Confirm?", 'تأكيد ؟ ']
  Save = ['Save', 'حفظ ']
  Skip = ['Skip', 'تخطي ']
  Clear = ['Clear', 'ازالة ']
  titleexitapp = ['Exip App', 'الخروج من البرنامج ']
  exitappmessage = ['Do you want to exit app', 'هل تريد الخروج من البرنامج ']
  msgConfirmTextLogoutMsg = ['Are you sure you want to Logout?', 'هل تريد فعلا الخروج من البرنامج ؟ ']
  delete_txt = ['Delete', 'حذف ']
  Edit_txt = ['Edit', 'تعديل ']

  Boat_Owner = ['MyBoat Owner', 'مالك القارب ']
  loginName = ['Enter Name', 'ادخل الاسم ']
  loginEmail = ['Email Address', 'عنوان البريد الالكتروني ']
  loginpassword = ['Passwod', 'كلمة المرور ']
  loginForgotPass = ['Forgot Password?', 'نسيت كلمة المرور ؟ ']
  logincpass = ['Confirm Password', 'تأكيد كلمة المرور ']
  loginterm1 = ['By signing up, you agree to our', 'عند التسجيل , انت موافق على ']
  loginterm2 = [' terms of service', ' شروط الخدمة ']
  loginterm3 = [' and', ' و ']
  loginterm4 = [' privacy policy', ' سياسة الخصوصية ']
  Signup_txt = ['Signup', 'تسجيل ']
  Login_txt = ['Login', 'تسجيل الدخول ']
  do_you1 = ['Do you have an account?', 'هل لديك حساب ؟ ']
  html_Privacy_Policy = [' Privacy Policy ', ' سياسة الخصوصية  ']
  text_About_Us = [' About Us', ' معلومات عنا  ']
  text_Terms_And_Conditions = [' Terms And Conditions ', ' الاحكام والشروط  ']
  //=========signup=======
  text_sign_in = ['Sign in', 'تسجيل الدخول ']
  text_sign_in1 = ['Sign in your social media account', 'قم بتسجيل الدخول بحساب الوسائط الاجتماعية الخاص بك ']
  text_remember_me = ['Remember me', 'تذكرني ']
  text_Guest = ['Continue As A Guest', 'دخول زائر ']
  dont_have_acc = ['Don’t have an account?', 'ليس لديك حساب ؟ ']
  txt_signup = ['Sign up', 'تسجيل ']
  last_name_txt = ['Last Name', 'الاسم الاخير ']
  first_name_txt = ['First Name', 'الاسم الاول ']
  phone_no_txt = ['Phone Number', 'رقم الهاتف المحمول ']
  Business_Name_no_txt = ['Business Name', 'الاسم التجاري ']
  choose_city_txt = ['Choose City', 'اختيار المدينة ']
  contact_To_ad_txt = ['Contact To Admin', 'تواصل مع المسئول ']
  //============Otp===========
  otp_verification = ['Verification', 'التحقق ']
  otp_verification1 = ['Otp verification code sent on', 'تم ارسال رمز التحقق ']
  txt_edit = ['Edit', 'تعديل ']
  txt_otp = ['Otp', 'رمز التحقق ']
  txt_RESEND = ['RESEND', 'اعادة ارسال ']
  txt_VERIFY = ['VERIFY', 'تحقق ']
  txt_Send = ['Send', 'ارسال ']
  //==========forgot================
  txt_Forgot_Pass1 = ['Forgot Password', 'نسيت كلمة المرور ']
  txt_Forgot_Pass2 = ['Please enter your email for reset account', 'الرجاء ادخال البريد الالكتروني لإعادة الحساب ']
  txt_Forgot_Pass3 = ['Submit', 'ارسال ']

  //edit profile=================
  Choose_City = ['Choose City', 'اختيار المدينة ']
  Choose_Gender = ['Select Gender', 'اختيار الجنس ']
  female_txt = ['Female', 'انثى ']
  male_txt = ['Male', 'ذكر ']
  Edit_Profile_txt = ['Edit Profile', 'تعديل الملف ']
  dob_txt = ['Date of birth', 'تاريخ الميلاد ']
  Gender_txt = ['Gender', 'الجنس ']
  about_txt = ['About', 'About']
  Take_a_photo_txt = ['Take a photo', 'التقاط صورة ']
  Choose_from_library_txt = ['Choose from library', 'اختر من مكتبة الصور ']
  settings_txt = ['Settings', 'اعدادات ']
  my_waallet_txt = ['My Wallet', 'المحفظة ']
  logout_txt = ['Logout', 'تسجيل الخروج ']
  //change pass================
  change_language_txt = ["Change Password", 'تغيير كلمة المرور ']
  old_pass_txt = ["Old Password", 'كلمة المرور القديمة ']
  new_pass_txt = ["New Password", 'كلمة المرور الجديدة ']
  c_pass_txt = ["Confirm Password", 'تأكيد كلمة المرور ']
  txt_Submit = ["Submit", 'ارسال ']
  //setting============
  text_account = ["Account", "حساب "]
  text_Notification_Setting = ["Notification Setting", "اعدادات التنبيهات "]
  text_Change_Language = ["Change Language", "تغيير اللغة "]
  text_support = ['Support', "الدعم "]
  text_share_app = ['Share App', "مشاركة التطبيق "]
  text_rate_app = ['Rate App', "تقييم التطبيق "]
  //change notification==============
  txt_Notification_Settings = ["Notification Settings", "اعدادات التنبيهات "]
  txt_Chat_Notifications = ["Chat Notifications", "تنبيهات المحادثة "]
  txt_ongo_Notifications = ["On Going Notifications", "تنبيهات الرحلات الحالية "]
  txt_Promotion_notification = ["Promotional Notifications", "تنبيهات العروض "]

  //contact us=============
  txt_message = ["Message", "رسالة "]
  contact_us_txt = ["Contact Us", "تواصل معنا "]
  Send_txt = ["Send", "ارسل "]

  //profile==============
  pro_manage_boat_txt = ['Manage Your Boat', "ادارة القوارب "]
  pro_withdrawal_txt = ['Withdrawal', "خاصية السحب "]
  pro_statement     = ['Statement', "كشف الحساب"]
  pro_earning_txt   = ['Earn', "الأرباح"]
  pro_History_txt   = ['History', "السجل "]
  pro_my_wallet_txt = ['My Wallet', "المحفظة "]
  pro_Review_txt = ['Review', "التقييم "]

  //manage advertisement=================
  manage_adver_txt = ['Manage Advertisement', "ادارة الاعلان "]
  add_adver_txt = ['Add Advertisement', "اضف اعلان "]
  advertisements_txt = ['Advertisements', "اعلان "]
  Discount_txt = ['Discount', "خصم "]

  //add boat============
  add_boat_txt = ['Add Boat', "اضف قارب "]
  boat_name_txt = ['Boat Name', "اسم القارب "]
  boat_no_txt = ['Boat Number', "رقم القارب "]
  boat_reg_txt = ['Boat register number', "رقم تسجيل القارب "]
  boat_year_txt = ['Boat year', "سنة صنع القارب "]
  boat_len_txt = ['Boat length', "حجم القارب "]
  boat_cap_txt = ['Boat capacity', "عدد ركاب القارب "]
  // delete boat=============
  boat_delete_confir = ['You really want to delete boat', "هل تريد فعلا حذف القارب "]
  //add advertisement-------------
  data_not_found = ['Data Not Found', "لا توجد بيانات "]
  Minimum_Hours_txt = ['Minimum Hours', "ساعات الرحلة"]
  Extrea_per_txt = ["Extra per hour price", " الساعة الاضافية "]
  discount_per_txt_per_txt = ["Discount", "خصم "]

  Extra_hours_price_txt = ["Extra Hours Price", " الساعات الاضافية "]
  toilets_txt = ["Toilets", "دورة مياه "]
  Description_txt = ["Description", "الوصف "]

  //edit===
  edit_adver_txt = ['Edit Advertisement', "تعديل الاعلان "]

  //managaae boat========
  Manage_Your_Boat_txt = ['Manage Your Boat', "ادارة القوارب "]
  Add_txt = ['Add', "اضافة "]
  Capacity_Maximum_Persons_txt = ['Capacity - Maximum Persons', "عدد الركاب - اقصى عدد ركاب "]
  Edit_boat_txt = ['Edit Boat', "تعديل القارب "]
  Boat_number = ['Boat Number', "رقم القارب "]
  //manage unabvailibity====
  unavailibity_na_txt = ['You have not mentioned  availability date', "لم تقم بذكر تاريخ التوافر "]
  unavailibit_txt = ['Unavailablity', "عدم التوافر "]
  already_dis_txt = ['You already disabled this date', "انت قمت بتعطيل هذا التاريخ "]
  already_booked_txt = ["You can't select this date,Because this date is booked", "لا تستطيع اختيار هذا اليوم حيث يوجد حجز "]
  managae_avail_txt = ['Manage unavailablity', "ادارة عدم التوافر "]
  empty_boat_ids = ['Please select boat id', "الرجاء اختيار رقم القارب "]
  // bank=
  txt_bank_name = ['Bank Name',"اسم البنك"]
  txt_term=["You can not perform any action because bank is approved by admin"," لا يمكنك القيام بأي اجراء لان الحساب موافق عليه من قبل المسئول"]
  txt_acc_title_name = ['Account Title Name',"اسم عنوان الحساب"]
  txt_acc_swift_code = ['Swift Code',"رمز السرعة"]
  txt_add_bank = ['Add Bank', 'اضف بنك ']
  txt_bank_holder = ['Bank Holder Name', "اسم البنك "]
  txt_acc_no = ['Acount Number', "رقم الحساب "]
  txt_ifsc_code = ['IBAN Code', "رقم الايبان "]
  txt_chat = ["Chat", "محادثة "]
  txt_cancel_booking = ["Cancel Booking", "الغاء الحجز "]
  txt_change_booking_date = ["Change Booking Date", "تغيير تاريخ الحجز "]
  txt_booking_details = ["Booking Detail", "تفاصيل الحجز "]
  txt_address = ["Address", "العنوان "]

  //add advertisement-------------
  select_trip_type = ['Select Trip Type', "اختر نوع الرحلة "]
  Ideal_Hours_txt = ['Idle Hours', "ساعات الصيانة "]
  Select_Boat_txt = ['Select Boat', "اختر القارب "]
  Year_txt = ['Years', "سنة الصنع "]
  Capacity_txt = ['Capacity', "عدد الركاب"]
  Hours_txt = ['Hours', "ساعات‎ "]
  Upload_pictures_txt = ['Upload pictures', "تحميل الصور"]
  Please_pictures_txt = ['Please upload (Max 8 pictures)', "الرجاء تحميل ( بحد اقصى 8 صور )"]
  Enter_Title_Arabic_txt = ['Enter Title in Arabic', "ادخل العنوان بالعربي "]
  Enter_Title_englis_txt = ['Enter Title in English', "ادخل العنوان بالانجليزي "]
  contact_number_txt = ['Contact Number', "رقم الهاتف "]
  max_people_txt = ['Max Number of People', "اقصى عدد ركاب "]
  place_of_boat_txt = ['Place of boat', "موقع القارب "]
  select_trip_txt = ['Select trip type', "اختر نوع الرحلة "]
  description_ar_txt = ['Descriptions In Arabic', "الوصف بالعربي "]
  description_en_txt = ['Descriptions In English', "الوصف بالانجليزي "]
  Rental_Price_txt = ["Rental Price", "سعر الحجز "]

  Extra_hours_price_txt = ["Extra Hours Price", " الساعة الاضافية "]
  discount_per_txt = ["Discount %", "الخصم % "]
  lenghth_txt = ["Length", "حجم القارب"]
  toilets_txt = ["Toilets", "دورة مياه "]
  cabins_txt = ["Cabins", "غرفة "]
  Description_txt = ["Description", "الوصف "]
  Address_txt = ["Address", "العنوان"]
  rental_amt_txt = ["Rental Amount", "مبلغ الحجز "]
  Rate_now = ['Rate Now', "تقييم الان "]
  txt_inprogress = ["Inprogress", "الرحلات الحالية "]
  txt_cancel_by_o = ["Cancel By Owner", "الغاء عن طريق المالك "]
  txt_cancel_by_u = ["Cancel By User", "الغاء عن طريق العميل "]
  txt_complete = ["Complete", "مكتمل "]
  txt_Confirmed = ["Confirmed", "تأكيد"]
  txt_pending = ["Pending", "معلق "]

  txt_change_booking_date = ["Change Booking Date & Time", "تغيير الحجز , التاريخ والوقت "]
  txt_change_booking_date1 = ["Change Booking Date Time", "تغيير الحجز التاريخ الوقت "]
  txt_date = ["Date", "التاريخ"]
  txt_time = ["Time", "الوقت "]

  txt_select_boat = ["Select Boat", "اختر القارب "]
  txt_all = ["All", "الجميع "]
  edit_bank = ['Edit Bank', "تعديل البنك "]
  txt_search_city = ['Search City', "اختر المدينة "]

  edit_profile = ["Edit Profile", "تعديل الملف "]
  txt_update = ["Update", "تحديث "]

  txt_history = ["History", "السجل "]
  txt_search_booking_no = ["Search By Booking Number...", "البحث برقم الحجز . . . "]
  txt_ongoing = ["Ongoing", "رحلات حالية "]
  txt_upcomming = ["Upcoming", "رحلات قادمة "]
  txt_Home = ["Home", "الرئيسية"]
  txt_Home_searech = ["Search Here...", "ابحث هنا . . . "]
  txt_Home_searech1 = ["Home Search", "الرئيسية بحث . . . "]
  txt_searech_adver = ["Search By Adver Name...", "بحث بإسم الاعلان . . . "]
  txt_search = ["Search", "بحث "]
  txt_done = ["Done", "اتمام "]
  txt_search_location = ["Search Location", "بحث حسب الموقع "]
  txt_clear = ["Clear", "ازالة "]
  txt_rating = ["Rating", "تقييم "]
  txt_pending_amt = ["Pending Amount", "المبلغ المعلق "]
  txt_totol_amt = ["Total Amount", "اجمالي المبلغ "]
  txt_my_wallet = ["My Wallet", "My المحفظة "]
  txt_Earning = ["Earning", "كسب"]
  txt_my_widro = ["My Withdrawal", "السحب "]
  txt_widro_req = ["Withdrawal Request", "طلب سحب "]
  txt_widro_Ac_no = ["Ac no.", "حساب رقم "]
  txt_widro_ifsc_code = ["IBAN Code ", "رقم ايبان "]
  txt_select_address=["Select address","حدد العنوان"]
  confirmBankMsg=["First you add bank details then you can able to add multiple advertisement","قم أولاً بإضافة التفاصيل المصرفية ، ثم يمكنك إضافة إعلانات متعددة"]
  confirmBankMsg1=["You cannot add advertisement until your added bank details not verified by admin","لا يمكنك إضافة إعلان حتى  يتم التحقق من التفاصيل المصرفية المضافة الخاصة بك من قبل المسئول"]
  mark_complete = ['Mark Complete','وضع علامة اكتمال']
  txt_KWD=['KWD',"د.ك"]
}
export const Lang_chg = new Language_provider();