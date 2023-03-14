/*
 * Get the name of the languae from the code
 */
function getLanguage(code) {
	var langs = {
		"abk":"Abkhaz",
		"ace":"Achinese",
		"ach":"Acoli",
		"ada":"Adangme",
		"ady":"Adygei",
		"aar":"Afar",
		"afh":"Afrihili (Artificial language)",
		"afr":"Afrikaans",
		"afa":"Afroasiatic (Other)",
		"ain":"Ainu",
		"aka":"Akan",
		"akk":"Akkadian",
		"alb":"Albanian",
		"ale":"Aleut",
		"alg":"Algonquian (Other)",
		"alt":"Altai",
		"tut":"Altaic (Other)",
		"amh":"Amharic",
		"anp":"Angika",
		"apa":"Apache languages",
		"ara":"Arabic",
		"arg":"Aragonese",
		"arc":"Aramaic",
		"arp":"Arapaho",
		"arw":"Arawak",
		"arm":"Armenian",
		"rup":"Aromanian",
		"art":"Artificial (Other)",
		"asm":"Assamese",
		"ath":"Athapascan (Other)",
		"aus":"Australian languages",
		"map":"Austronesian (Other)",
		"ava":"Avaric",
		"ave":"Avestan",
		"awa":"Awadhi",
		"aym":"Aymara",
		"aze":"Azerbaijani",
		"ast":"Bable",
		"ban":"Balinese",
		"bat":"Baltic (Other)",
		"bal":"Baluchi",
		"bam":"Bambara",
		"bai":"Bamileke languages",
		"bad":"Banda languages",
		"bnt":"Bantu (Other)",
		"bas":"Basa",
		"bak":"Bashkir",
		"baq":"Basque",
		"btk":"Batak",
		"bej":"Beja",
		"bel":"Belarusian",
		"bem":"Bemba",
		"ben":"Bengali",
		"ber":"Berber (Other)",
		"bho":"Bhojpuri",
		"bih":"Bihari (Other)",
		"bik":"Bikol",
		"byn":"Bilin",
		"bis":"Bislama",
		"zbl":"Blissymbolics",
		"bos":"Bosnian",
		"bra":"Braj",
		"bre":"Breton",
		"bug":"Bugis",
		"bul":"Bulgarian",
		"bua":"Buriat",
		"bur":"Burmese",
		"cad":"Caddo",
		"car":"Carib",
		"cat":"Catalan",
		"cau":"Caucasian (Other)",
		"ceb":"Cebuano",
		"cel":"Celtic (Other)",
		"cai":"Central American Indian (Other)",
		"chg":"Chagatai",
		"cmc":"Chamic languages",
		"cha":"Chamorro",
		"che":"Chechen",
		"chr":"Cherokee",
		"chy":"Cheyenne",
		"chb":"Chibcha",
		"chi":"Chinese",
		"chn":"Chinook jargon",
		"chp":"Chipewyan",
		"cho":"Choctaw",
		"chu":"Church Slavic",
		"chk":"Chuukese",
		"chv":"Chuvash",
		"cop":"Coptic",
		"cor":"Cornish",
		"cos":"Corsican",
		"cre":"Cree",
		"mus":"Creek",
		"crp":"Creoles and Pidgins (Other)",
		"cpe":"Creoles and Pidgins, English-based (Other)",
		"cpf":"Creoles and Pidgins, French-based (Other)",
		"cpp":"Creoles and Pidgins, Portuguese-based (Other)",
		"crh":"Crimean Tatar",
		"hrv":"Croatian",
		"cus":"Cushitic (Other)",
		"cze":"Czech",
		"dak":"Dakota",
		"dan":"Danish",
		"dar":"Dargwa",
		"day":"Dayak",
		"del":"Delaware",
		"din":"Dinka",
		"div":"Divehi",
		"doi":"Dogri",
		"dgr":"Dogrib",
		"dra":"Dravidian (Other)",
		"dua":"Duala",
		"dut":"Dutch",
		"dum":"Dutch, Middle (ca. 1050-1350)",
		"dyu":"Dyula",
		"dzo":"Dzongkha",
		"frs":"East Frisian",
		"bin":"Edo",
		"efi":"Efik",
		"egy":"Egyptian",
		"eka":"Ekajuk",
		"elx":"Elamite",
		"eng":"English",
		"enm":"English, Middle (1100-1500)",
		"ang":"English, Old (ca. 450-1100)",
		"myv":"Erzya",
		"epo":"Esperanto",
		"est":"Estonian",
		"gez":"Ethiopic",
		"ewe":"Ewe",
		"ewo":"Ewondo",
		"fan":"Fang",
		"fat":"Fanti",
		"fao":"Faroese",
		"fij":"Fijian",
		"fil":"Filipino",
		"fin":"Finnish",
		"fiu":"Finno-Ugrian (Other)",
		"fon":"Fon",
		"fre":"French",
		"frm":"French, Middle (ca. 1300-1600)",
		"fro":"French, Old (ca. 842-1300)",
		"fry":"Frisian",
		"fur":"Friulian",
		"ful":"Fula",
		"gaa":"Gã",
		"glg":"Galician",
		"lug":"Ganda",
		"gay":"Gayo",
		"gba":"Gbaya",
		"geo":"Georgian",
		"ger":"German",
		"gmh":"German, Middle High (ca. 1050-1500)",
		"goh":"German, Old High (ca. 750-1050)",
		"gem":"Germanic (Other)",
		"gil":"Gilbertese",
		"gon":"Gondi",
		"gor":"Gorontalo",
		"got":"Gothic",
		"grb":"Grebo",
		"grc":"Greek, Ancient (to 1453)",
		"gre":"Greek, Modern (1453-)",
		"grn":"Guarani",
		"guj":"Gujarati",
		"gwi":"Gwich'in",
		"hai":"Haida",
		"hat":"Haitian French Creole",
		"hau":"Hausa",
		"haw":"Hawaiian",
		"heb":"Hebrew",
		"her":"Herero",
		"hil":"Hiligaynon",
		"hin":"Hindi",
		"hmo":"Hiri Motu",
		"hit":"Hittite",
		"hmn":"Hmong",
		"hun":"Hungarian",
		"hup":"Hupa",
		"iba":"Iban",
		"ice":"Icelandic",
		"ido":"Ido",
		"ibo":"Igbo",
		"ijo":"Ijo",
		"ilo":"Iloko",
		"smn":"Inari Sami",
		"inc":"Indic (Other)",
		"ine":"Indo-European (Other)",
		"ind":"Indonesian",
		"inh":"Ingush",
		"ina":"Interlingua (International Auxiliary Language Association)",
		"ile":"Interlingue",
		"iku":"Inuktitut",
		"ipk":"Inupiaq",
		"ira":"Iranian (Other)",
		"gle":"Irish",
		"mga":"Irish, Middle (ca. 1100-1550)",
		"sga":"Irish, Old (to 1100)",
		"iro":"Iroquoian (Other)",
		"ita":"Italian",
		"jpn":"Japanese",
		"jav":"Javanese",
		"jrb":"Judeo-Arabic",
		"jpr":"Judeo-Persian",
		"kbd":"Kabardian",
		"kab":"Kabyle",
		"kac":"Kachin",
		"kal":"Kalâtdlisut",
		"kam":"Kamba",
		"kan":"Kannada",
		"kau":"Kanuri",
		"kaa":"Kara-Kalpak",
		"krc":"Karachay-Balkar",
		"krl":"Karelian",
		"kar":"Karen languages",
		"kas":"Kashmiri",
		"csb":"Kashubian",
		"kaw":"Kawi",
		"kaz":"Kazakh",
		"kha":"Khasi",
		"khm":"Khmer",
		"khi":"Khoisan (Other)",
		"kho":"Khotanese",
		"kik":"Kikuyu",
		"kmb":"Kimbundu",
		"kin":"Kinyarwanda",
		"tlh":"Klingon (Artificial language)",
		"kom":"Komi",
		"kon":"Kongo",
		"kok":"Konkani",
		"kut":"Kootenai",
		"kor":"Korean",
		"kos":"Kosraean",
		"kpe":"Kpelle",
		"kro":"Kru (Other)",
		"kua":"Kuanyama",
		"kum":"Kumyk",
		"kur":"Kurdish",
		"kru":"Kurukh",
		"kir":"Kyrgyz",
		"lad":"Ladino",
		"lah":"Lahndā",
		"lam":"Lamba (Zambia and Congo)",
		"lao":"Lao",
		"lat":"Latin",
		"lav":"Latvian",
		"lez":"Lezgian",
		"lim":"Limburgish",
		"lin":"Lingala",
		"lit":"Lithuanian",
		"jbo":"Lojban (Artificial language)",
		"nds":"Low German",
		"dsb":"Lower Sorbian",
		"loz":"Lozi",
		"lub":"Luba-Katanga",
		"lua":"Luba-Lulua",
		"lui":"Luiseño",
		"smj":"Lule Sami",
		"lun":"Lunda",
		"luo":"Luo (Kenya and Tanzania)",
		"lus":"Lushai",
		"ltz":"Luxembourgish",
		"mas":"Maasai",
		"mac":"Macedonian",
		"mad":"Madurese",
		"mag":"Magahi",
		"mai":"Maithili",
		"mak":"Makasar",
		"mlg":"Malagasy",
		"may":"Malay",
		"mal":"Malayalam",
		"mlt":"Maltese",
		"mnc":"Manchu",
		"mdr":"Mandar",
		"man":"Mandingo",
		"mni":"Manipuri",
		"mno":"Manobo languages",
		"glv":"Manx",
		"mao":"Maori",
		"arn":"Mapuche",
		"mar":"Marathi",
		"chm":"Mari",
		"mah":"Marshallese",
		"mwr":"Marwari",
		"myn":"Mayan languages",
		"men":"Mende",
		"mic":"Micmac",
		"min":"Minangkabau",
		"mwl":"Mirandese",
		"mis":"Miscellaneous languages",
		"moh":"Mohawk",
		"mdf":"Moksha",
		"mkh":"Mon-Khmer (Other)",
		"lol":"Mongo-Nkundu",
		"mon":"Mongolian",
		"mos":"Mooré",
		"mul":"Multiple languages",
		"mun":"Munda (Other)",
		"nqo":"N'Ko",
		"nah":"Nahuatl",
		"nau":"Nauru",
		"nav":"Navajo",
		"nbl":"Ndebele (South Africa)",
		"nde":"Ndebele (Zimbabwe)",
		"ndo":"Ndonga",
		"nap":"Neapolitan Italian",
		"nep":"Nepali",
		"new":"Newari",
		"nwc":"Newari, Old",
		"nia":"Nias",
		"nic":"Niger-Kordofanian (Other)",
		"ssa":"Nilo-Saharan (Other)",
		"niu":"Niuean",
		"zxx":"No linguistic content",
		"nog":"Nogai",
		"nai":"North American Indian (Other)",
		"frr":"North Frisian",
		"sme":"Northern Sami",
		"nso":"Northern Sotho",
		"nor":"Norwegian",
		"nob":"Norwegian (Bokmål)",
		"nno":"Norwegian (Nynorsk)",
		"nub":"Nubian languages",
		"nym":"Nyamwezi",
		"nya":"Nyanja",
		"nyn":"Nyankole",
		"nyo":"Nyoro",
		"nzi":"Nzima",
		"oci":"Occitan (post-1500)",
		"xal":"Oirat",
		"oji":"Ojibwa",
		"non":"Old Norse",
		"peo":"Old Persian (ca. 600-400 B.C.)",
		"ori":"Oriya",
		"orm":"Oromo",
		"osa":"Osage",
		"oss":"Ossetic",
		"oto":"Otomian languages",
		"pal":"Pahlavi",
		"pau":"Palauan",
		"pli":"Pali",
		"pam":"Pampanga",
		"pag":"Pangasinan",
		"pan":"Panjabi",
		"pap":"Papiamento",
		"paa":"Papuan (Other)",
		"per":"Persian",
		"phi":"Philippine (Other)",
		"phn":"Phoenician",
		"pon":"Pohnpeian",
		"pol":"Polish",
		"por":"Portuguese",
		"pra":"Prakrit languages",
		"pro":"Provençal (to 1500)",
		"pus":"Pushto",
		"que":"Quechua",
		"roh":"Raeto-Romance",
		"raj":"Rajasthani",
		"rap":"Rapanui",
		"rar":"Rarotongan",
		"roa":"Romance (Other)",
		"rom":"Romani",
		"rum":"Romanian",
		"run":"Rundi",
		"rus":"Russian",
		"sal":"Salishan languages",
		"sam":"Samaritan Aramaic",
		"smi":"Sami",
		"smo":"Samoan",
		"sad":"Sandawe",
		"sag":"Sango (Ubangi Creole)",
		"san":"Sanskrit",
		"sat":"Santali",
		"srd":"Sardinian",
		"sas":"Sasak",
		"sco":"Scots",
		"gla":"Scottish Gaelic",
		"sel":"Selkup",
		"sem":"Semitic (Other)",
		"srp":"Serbian",
		"srr":"Serer",
		"shn":"Shan",
		"sna":"Shona",
		"iii":"Sichuan Yi",
		"scn":"Sicilian Italian",
		"sid":"Sidamo",
		"sgn":"Sign languages",
		"bla":"Siksika",
		"snd":"Sindhi",
		"sin":"Sinhalese",
		"sit":"Sino-Tibetan (Other)",
		"sio":"Siouan (Other)",
		"sms":"Skolt Sami",
		"den":"Slavey",
		"sla":"Slavic (Other)",
		"slo":"Slovak",
		"slv":"Slovenian",
		"sog":"Sogdian",
		"som":"Somali",
		"son":"Songhai",
		"snk":"Soninke",
		"wen":"Sorbian (Other)",
		"sot":"Sotho",
		"sai":"South American Indian (Other)",
		"sma":"Southern Sami",
		"spa":"Spanish",
		"srn":"Sranan",
		"suk":"Sukuma",
		"sux":"Sumerian",
		"sun":"Sundanese",
		"sus":"Susu",
		"swa":"Swahili",
		"ssw":"Swazi",
		"swe":"Swedish",
		"gsw":"Swiss German",
		"syc":"Syriac",
		"syr":"Syriac, Modern",
		"tgl":"Tagalog",
		"tah":"Tahitian",
		"tai":"Tai (Other)",
		"tgk":"Tajik",
		"tmh":"Tamashek",
		"tam":"Tamil",
		"tat":"Tatar",
		"tel":"Telugu",
		"tem":"Temne",
		"ter":"Terena",
		"tet":"Tetum",
		"tha":"Thai",
		"tib":"Tibetan",
		"tig":"Tigré",
		"tir":"Tigrinya",
		"tiv":"Tiv",
		"tli":"Tlingit",
		"tpi":"Tok Pisin",
		"tkl":"Tokelauan",
		"tog":"Tonga (Nyasa)",
		"ton":"Tongan",
		"tsi":"Tsimshian",
		"tso":"Tsonga",
		"tsn":"Tswana",
		"tum":"Tumbuka",
		"tup":"Tupi languages",
		"tur":"Turkish",
		"ota":"Turkish, Ottoman",
		"tuk":"Turkmen",
		"tvl":"Tuvaluan",
		"tyv":"Tuvinian",
		"twi":"Twi",
		"udm":"Udmurt",
		"uga":"Ugaritic",
		"uig":"Uighur",
		"ukr":"Ukrainian",
		"umb":"Umbundu",
		"und":"Undetermined",
		"hsb":"Upper Sorbian",
		"urd":"Urdu",
		"uzb":"Uzbek",
		"vai":"Vai",
		"ven":"Venda",
		"vie":"Vietnamese",
		"vol":"Volapük",
		"vot":"Votic",
		"wak":"Wakashan languages",
		"wln":"Walloon",
		"war":"Waray",
		"was":"Washoe",
		"wel":"Welsh",
		"him":"Western Pahari languages",
		"wal":"Wolayta",
		"wol":"Wolof",
		"xho":"Xhosa",
		"sah":"Yakut",
		"yao":"Yao (Africa)",
		"yap":"Yapese",
		"yid":"Yiddish",
		"yor":"Yoruba",
		"ypk":"Yupik languages",
		"znd":"Zande languages",
		"zap":"Zapotec",
		"zza":"Zaza",
		"zen":"Zenaga",
		"zha":"Zhuang",
		"zul":"Zulu",
		"zun":"Zuni"
	}
	return langs[code];
}

function getCountry(code) {
	var countries = {
		"af":"Afghanistan",
		"alu":"Alabama",
		"aku":"Alaska",
		"aa":"Albania",
		"abc":"Alberta",
		"ae":"Algeria",
		"as":"American Samoa",
		"an":"Andorra",
		"ao":"Angola",
		"am":"Anguilla",
		"ay":"Antarctica",
		"aq":"Antigua and Barbuda",
		"ag":"Argentina",
		"azu":"Arizona",
		"aru":"Arkansas",
		"ai":"Armenia (Republic)",
		"aw":"Aruba",
		"at":"Australia",
		"aca":"Australian Capital Territory",
		"au":"Austria",
		"aj":"Azerbaijan",
		"bf":"Bahamas",
		"ba":"Bahrain",
		"bg":"Bangladesh",
		"bb":"Barbados",
		"bw":"Belarus",
		"be":"Belgium",
		"bh":"Belize",
		"dm":"Benin",
		"bm":"Bermuda Islands",
		"bt":"Bhutan",
		"bo":"Bolivia",
		"bn":"Bosnia and Hercegovina",
		"bs":"Botswana",
		"bv":"Bouvet Island",
		"bl":"Brazil",
		"bcc":"British Columbia",
		"bi":"British Indian Ocean Territory",
		"vb":"British Virgin Islands",
		"bx":"Brunei",
		"bu":"Bulgaria",
		"uv":"Burkina Faso",
		"br":"Burma",
		"bd":"Burundi",
		"cv":"Cabo Verde",
		"cau":"California",
		"cb":"Cambodia",
		"cm":"Cameroon",
		"xxc":"Canada",
		"ca":"Caribbean Netherlands",
		"cj":"Cayman Islands",
		"cx":"Central African Republic",
		"cd":"Chad",
		"cl":"Chile",
		"cc":"China",
		"ch":"China (Republic : 1949- )",
		"xa":"Christmas Island (Indian Ocean)",
		"xb":"Cocos (Keeling) Islands",
		"ck":"Colombia",
		"cou":"Colorado",
		"cq":"Comoros",
		"cf":"Congo (Brazzaville)",
		"cg":"Congo (Democratic Republic)",
		"ctu":"Connecticut",
		"cw":"Cook Islands",
		"xga":"Coral Sea Islands Territory",
		"cr":"Costa Rica",
		"iv":"Côte d'Ivoire",
		"ci":"Croatia",
		"cu":"Cuba",
		"co":"Curaçao",
		"cy":"Cyprus",
		"xr":"Czech Republic",
		"deu":"Delaware",
		"dk":"Denmark",
		"dcu":"District of Columbia",
		"ft":"Djibouti",
		"dq":"Dominica",
		"dr":"Dominican Republic",
		"ec":"Ecuador",
		"ua":"Egypt",
		"es":"El Salvador",
		"enk":"England",
		"eg":"Equatorial Guinea",
		"ea":"Eritrea",
		"er":"Estonia",
		"et":"Ethiopia",
		"fk":"Falkland Islands",
		"fa":"Faroe Islands",
		"fj":"Fiji",
		"fi":"Finland",
		"flu":"Florida",
		"fr":"France",
		"fg":"French Guiana",
		"fp":"French Polynesia",
		"go":"Gabon",
		"gm":"Gambia",
		"gz":"Gaza Strip",
		"gau":"Georgia",
		"gs":"Georgia (Republic)",
		"gw":"Germany",
		"gh":"Ghana",
		"gi":"Gibraltar",
		"gr":"Greece",
		"gl":"Greenland",
		"gd":"Grenada",
		"gp":"Guadeloupe",
		"gu":"Guam",
		"gt":"Guatemala",
		"gv":"Guinea",
		"pg":"Guinea-Bissau",
		"gy":"Guyana",
		"ht":"Haiti",
		"hiu":"Hawaii",
		"hm":"Heard and McDonald Islands",
		"ho":"Honduras",
		"hu":"Hungary",
		"ic":"Iceland",
		"idu":"Idaho",
		"ilu":"Illinois",
		"ii":"India",
		"inu":"Indiana",
		"io":"Indonesia",
		"iau":"Iowa",
		"ir":"Iran",
		"iq":"Iraq",
		"iy":"Iraq-Saudi Arabia Neutral Zone",
		"ie":"Ireland",
		"is":"Israel",
		"it":"Italy",
		"jm":"Jamaica",
		"ja":"Japan",
		"ji":"Johnston Atoll",
		"jo":"Jordan",
		"ksu":"Kansas",
		"kz":"Kazakhstan",
		"kyu":"Kentucky",
		"ke":"Kenya",
		"gb":"Kiribati",
		"kn":"Korea (North)",
		"ko":"Korea (South)",
		"kv":"Kosovo",
		"ku":"Kuwait",
		"kg":"Kyrgyzstan",
		"ls":"Laos",
		"lv":"Latvia",
		"le":"Lebanon",
		"lo":"Lesotho",
		"lb":"Liberia",
		"ly":"Libya",
		"lh":"Liechtenstein",
		"li":"Lithuania",
		"lau":"Louisiana",
		"lu":"Luxembourg",
		"xn":"Macedonia",
		"mg":"Madagascar",
		"meu":"Maine",
		"mw":"Malawi",
		"my":"Malaysia",
		"xc":"Maldives",
		"ml":"Mali",
		"mm":"Malta",
		"mbc":"Manitoba",
		"xe":"Marshall Islands",
		"mq":"Martinique",
		"mdu":"Maryland",
		"mau":"Massachusetts",
		"mu":"Mauritania",
		"mf":"Mauritius",
		"ot":"Mayotte",
		"mx":"Mexico",
		"miu":"Michigan",
		"fm":"Micronesia (Federated States)",
		"xf":"Midway Islands",
		"mnu":"Minnesota",
		"msu":"Mississippi",
		"mou":"Missouri",
		"mv":"Moldova",
		"mc":"Monaco",
		"mp":"Mongolia",
		"mtu":"Montana",
		"mo":"Montenegro",
		"mj":"Montserrat",
		"mr":"Morocco",
		"mz":"Mozambique",
		"sx":"Namibia",
		"nu":"Nauru",
		"nbu":"Nebraska",
		"np":"Nepal",
		"ne":"Netherlands",
		"nvu":"Nevada",
		"nkc":"New Brunswick",
		"nl":"New Caledonia",
		"nhu":"New Hampshire",
		"nju":"New Jersey",
		"nmu":"New Mexico",
		"xna":"New South Wales",
		"nyu":"New York (State)",
		"nz":"New Zealand",
		"nfc":"Newfoundland and Labrador",
		"nq":"Nicaragua",
		"ng":"Niger",
		"nr":"Nigeria",
		"xh":"Niue",
		"xx":"No place, unknown, or undetermined",
		"nx":"Norfolk Island",
		"ncu":"North Carolina",
		"ndu":"North Dakota",
		"nik":"Northern Ireland",
		"nw":"Northern Mariana Islands",
		"xoa":"Northern Territory",
		"ntc":"Northwest Territories",
		"no":"Norway",
		"nsc":"Nova Scotia",
		"nuc":"Nunavut",
		"ohu":"Ohio",
		"oku":"Oklahoma",
		"mk":"Oman",
		"onc":"Ontario",
		"oru":"Oregon",
		"pk":"Pakistan",
		"pw":"Palau",
		"pn":"Panama",
		"pp":"Papua New Guinea",
		"pf":"Paracel Islands",
		"py":"Paraguay",
		"pau":"Pennsylvania",
		"pe":"Peru",
		"ph":"Philippines",
		"pc":"Pitcairn Island",
		"pl":"Poland",
		"po":"Portugal",
		"pic":"Prince Edward Island",
		"pr":"Puerto Rico",
		"qa":"Qatar",
		"quc":"Québec (Province)",
		"qea":"Queensland",
		"re":"Réunion",
		"riu":"Rhode Island",
		"rm":"Romania",
		"ru":"Russia (Federation)",
		"rw":"Rwanda",
		"xj":"Saint Helena",
		"xd":"Saint Kitts-Nevis",
		"xk":"Saint Lucia",
		"xl":"Saint Pierre and Miquelon",
		"xm":"Saint Vincent and the Grenadines",
		"sc":"Saint-Barthélemy",
		"st":"Saint-Martin",
		"ws":"Samoa",
		"sm":"San Marino",
		"sf":"Sao Tome and Principe",
		"snc":"Saskatchewan",
		"su":"Saudi Arabia",
		"stk":"Scotland",
		"sg":"Senegal",
		"rb":"Serbia",
		"se":"Seychelles",
		"sl":"Sierra Leone",
		"si":"Singapore",
		"sn":"Sint Maarten",
		"xo":"Slovakia",
		"xv":"Slovenia",
		"bp":"Solomon Islands",
		"so":"Somalia",
		"sa":"South Africa",
		"xra":"South Australia",
		"scu":"South Carolina",
		"sdu":"South Dakota",
		"xs":"South Georgia and the South Sandwich Islands",
		"sd":"South Sudan",
		"sp":"Spain",
		"sh":"Spanish North Africa",
		"xp":"Spratly Island",
		"ce":"Sri Lanka",
		"sj":"Sudan",
		"sr":"Surinam",
		"sq":"Swaziland",
		"sw":"Sweden",
		"sz":"Switzerland",
		"sy":"Syria",
		"ta":"Tajikistan",
		"tz":"Tanzania",
		"tma":"Tasmania",
		"tnu":"Tennessee",
		"fs":"Terres australes et antarctiques françaises",
		"txu":"Texas",
		"th":"Thailand",
		"em":"Timor-Leste",
		"tg":"Togo",
		"tl":"Tokelau",
		"to":"Tonga",
		"tr":"Trinidad and Tobago",
		"ti":"Tunisia",
		"tu":"Turkey",
		"tk":"Turkmenistan",
		"tc":"Turks and Caicos Islands",
		"tv":"Tuvalu",
		"ug":"Uganda",
		"un":"Ukraine",
		"ts":"United Arab Emirates",
		"xxk":"United Kingdom",
		"uik":"United Kingdom Misc. Islands",
		"xxu":"United States",
		"uc":"United States Misc. Caribbean Islands",
		"up":"United States Misc. Pacific Islands",
		"uy":"Uruguay",
		"utu":"Utah",
		"uz":"Uzbekistan",
		"nn":"Vanuatu",
		"vp":"Various places",
		"vc":"Vatican City",
		"ve":"Venezuela",
		"vtu":"Vermont",
		"vra":"Victoria",
		"vm":"Vietnam",
		"vi":"Virgin Islands of the United States",
		"vau":"Virginia",
		"wk":"Wake Island",
		"wlk":"Wales",
		"wf":"Wallis and Futuna",
		"wau":"Washington (State)",
		"wj":"West Bank of the Jordan River",
		"wvu":"West Virginia",
		"wea":"Western Australia",
		"ss":"Western Sahara",
		"wiu":"Wisconsin",
		"wyu":"Wyoming",
		"ye":"Yemen",
		"ykc":"Yukon Territory",
		"za":"Zambia",
		"rh":"Zimbabwe"
	}
	return countries[code];
}

/*
 * Basic tag layout for a single piece of data
 *
 * prop: 	Name of Schema.org property
 * content: Input data being associate with prop
 * meta: 	Boolean that is true if we are building a metadata tag, and false if we are creating visible content 
 * label: 	What kind of content is being displayed 
 */
function buildTag(prop,content,meta,label) {
	if (meta) {
		return '\t\t<meta itemprop="' + prop + '" content="' + content + '"/>\n';
	}
	else {
		return '\t\t\t<dt>' + label + ':</dt>\n\t\t\t<dd itemprop="' + prop + '"><b>' + content + '</b></dd>\n';
	}
}

function buildItemscopeTag(prop,type,content) {
	return '\t\t\t<div itemprop="' + prop + '" itemscope itemtype="' + type + '">\n' + content + '\t\t\t</div>\n';
}

/*
 * For labeling an element wtih a Scehema.org property when the element is part of an atypical HTML tag, and 
 * embeded umong other information
 *
 * prop: 	Name of the Schema.org property
 * content: Input data being associated with prop
 */
function buildSpan(prop,content) {
	return '<span itemprop="' + prop + '">' + content + '</span>';
}

/*
 * Create a new div for each person listed as a contributer, switching the itemscope to person. Separately label
 * the family name and given name.
 */
function listPerson(family,given,role) {
	if (role != 'aut') {
		role = 'ctb';
	}
	var role_index = { 'art': 'contributor', 'aut': 'author', 'ctb': 'contributor', 'edt': 'editor', 'ill': 'illustrator', 'trl': 'contributor'};
	var prop = role_index[role];
	var output_string = '\t\t\t<div itemprop="' + prop + '" itemscope itemtype="http://schema.org/Person">\n';
	output_string += '\t\t\t\t<dt>' + role_index[role].charAt(0).toUpperCase() + role_index[role].slice(1) + ':</dt>\n';
	output_string += '\t\t\t\t<dd><b>';
	if (checkExists(family) && checkExists(given)) {
		output_string += buildSpan('familyName',family) + ', ' + buildSpan('givenName',given);
	}
	else if (checkExists(family) || checkExists(given)) {
		if (checkExists(family)) {
			output_string += buildSpan('familyName',family);
		}
		else {
			output_string += buildSpan('givenName',given);
		}
	}
	output_string += '</b></dd>\n';
	output_string += '\t\t\t</div>\n';
	return output_string;
}

function listCorporation(corporation) {
	var role_index = { 'cre': 'creator', 'ctb': 'contributor' };
	var prop = role_index[corporation['role']];
	var output_string = '\t\t\t<div itemprop="' + prop + '" itemscope itemtype="http://schema.org/Organization">\n';
	output_string += '\t\t\t\t<dt>' + prop.charAt(0).toUpperCase() + prop.slice(1) + ':</dt>\n';
	output_string += '\t\t\t\t<dd><b>'
	output_string += buildSpan('legalName',corporation['corporate']);
	output_string += '</b></dd>\n';
	output_string += '\t\t\t</div>\n';
	return output_string
}

/*
 * Build an HTML page with Schema.org labels for the content. Two strings are maintained: metaTags holds metadata that
 * the page will be associated with on search, but displayes no content. displayTags holds the content that is viewable
 * in a browser, with the appropriate content being labeled. At the end the two strings are combined into the text string
 *
 * record: 			 object containing the user-input data
 * institution_info: object containing name of institution creating record
 */
function downloadHTML(record,institution_info) {
	var metaTags = '';
	var displayTags = '';

	metaTags += buildTag('inLanguage',record.language,true,'');

	var subtitleTag = '';
	if (checkExists(record.title[0]['subtitle'])) {
		subtitleTag = ': ' + record.title[0]['subtitle'];
	}

	displayTags += buildTag('name',record.title[0]['title'] + subtitleTag,false,'Title');

	var translitSubTag = '';
	if (checkExists(record.title[1]['subtitle'])) {
		translitSubTag = ': ' + record.title[1]['subtitle'] + '.';
	}

	if (checkExists(record.title[1]['title'])) {
		displayTags += buildTag('alternateName',record.title[1]['title'] + translitSubTag,false,'Transliterated Title');
	}

	displayTags += buildTag('url','<a href="' + record.web_url + '">' + record.web_url + '</a>',false,'Web URL');

	if (checkExists(record.isbn)) {
		displayTags += buildTag('isbn',record.isbn,false,'ISBN');
	}

	if (checkExists(record.author[0]['role']) && (checkExists(record.author[0]['given']) || checkExists(record.author[0]['family']))) {
		displayTags += listPerson(record.author[0]['family'],record.author[0]['given'],record.author[0]['role']);
	}

	if (checkExists(record.additional_authors)) {
		for (var i = 0; i < record.additional_authors.length; i++) {
			if (checkExists(record.additional_authors[i][0]['family']) || checkExists(record.additional_authors[i][0]['given'])) {
				displayTags += listPerson(record.additional_authors[i][0]['family'],record.additional_authors[i][0]['given'],record.additional_authors[i][0]['role']);
			}
		}
	}

	if (checkExists(record.corporate_author[0]['corporate'])) {
		displayTags += listCorporation(record.corporate_author[0]);
	}

	if (checkExists(record.additional_corporate_names)) {
		for (var i = 0; i < record.additional_corporate_names.length; i++) {
			if (checkExists(record.additional_corporate_names[i][0]['corporate'])) {
				displayTags += listCorporation(record.additional_corporate_names[i][0]);
			}
		}
	}

	if (checkExists(record.edition)) {
		displayTags += buildTag('bookEdition',record.edition,false,'Edition Statement');
	}

	if (checkExists(record.publisher)) {
		displayTags += buildTag('publisher',record.publisher,false,'Publisher');
	}

	if (checkExists(record.publication_place) || checkExists(record.publication_country)) {
		var content = '';
		if (checkExists(record.publication_place)) {
			content += '<span itemprop="addressLocality">' + record.publication_place + '</span>';
			if (checkExists(record.publication_country)) {
				content += ', ';
			}
		}
		if (checkExists(record.publication_country)) {
			content += '<span itemprop="addressRegion">' + getCountry(record.publication_country) + '</span>';
		}
		var publication_location = buildItemscopeTag('publication','http://schema.org/PublicationEvent',buildItemscopeTag('location','http://schema.org/PostalAddress','\t\t\t\t<dt>Publication Location:</dt>\n\t\t\t\t<dd><b>' + content + '</b></dd>\n'));
		displayTags += publication_location;
	}

	if (checkExists(record.publication_year)) {
		displayTags += buildTag('datePublished',record.publication_year,false,'Date of Publication');
	}

	if (checkExists(record.copyright_year)) {
		displayTags += buildTag('copyrightYear',record.copyright_year,false,'Date of Copyright');
	}

	var ill = '';
	if (checkExists(record.illustrations_yes) && record.illustrations_yes == true) {
		ill = 'illustrations';
	}

	if (ill != '' || checkExists(record.pages)) {
		displayTags += '\t\t\t<dt>Physical Description:</dt>\n\t\t\t<dd><b>';
		if (checkExists(record.pages)) {
			displayTags += buildSpan('numberOfPages',record.pages) + ' ' + record.volume_or_page;
		}
		if (ill != '' && checkExists(record.pages)) {
			displayTags += '; ';
		}
		if (ill != '') {
			displayTags += ill;
		}
		displayTags += '</b></dd>\n';
	}

	displayTags += '\t\t\t<dt>Language:</dt>\n\t\t\t<dd><b>' + getLanguage(record.language) + '</b></dd>\n';

	if (checkExists(record.datecollected)) {
		displayTags += buildTag('dateCreated',record.datecollected,false,'Date the Data Was Collected');
	}

	if (checkExists(record.access_terms)) {
		displayTags += buildTag('license',record.access_terms,false,'Access Terms');
	}

	if (checkExists(record.gcoverage)) {
		displayTags += '\t\t\t<div itemprop"contentLocation" itemscope itemtype="http://schema.org/Place">\n\t\t\t\t<dt>Geographic Coverage:</dt>\n\t\t\t\t<dd><b><span itemprop="name">' + record.gcoverage + '</span></b></dd>\n\t\t\t</div>\n';
//		displayTags += '\t\t\t<creativeWork>\n\t\t\t\t<contentLocation>\n\t\t\t\t\t<place>\n\t\t\t\t\t\t<name>' + record.gcoverage + '</name>\n\t\t\t\t\t</place>\n\t\t\t\t</contentLocation>\n\t\t\t</creativeWork>\n';
//		displayTags += '\t\t\t<div itemprop="offers" itemscope itemtype="http://schema.org/Offer">\n\t\t\t\t<dt>Located At:</dt>\n\t\t\t\t<dd><b><span itemprop="seller" href="' + institution_info['html']['url'] + '">' + institution_info['html']['name'] + '</span></b></dd>\n\t\t\t</div>\n'; 
	}

	if (checkExists(record.ggranularity)) {
		displayTags += '\t\t\t<div itemprop"contentLocation" itemscope itemtype="http://schema.org/Place">\n\t\t\t\t<dt>Geographic Granularity:</dt>\n\t\t\t\t<dd><b><span itemprop="name">' + record.ggranularity + '</span></b></dd>\n\t\t\t</div>\n';
//		displayTags += '\t\t\t<creativeWork>\n\t\t\t\t<contentLocation>\n\t\t\t\t\t<place>\n\t\t\t\t\t\t<name>' + record.ggranularity + '</name>\n\t\t\t\t\t</place>\n\t\t\t\t</contentLocation>\n\t\t\t</creativeWork>\n';
	}

	if (checkExists(record.format)) {
		displayTags += buildTag('fileFormat',record.format,false,'File Format');
	}

	if (checkExists(record.use_terms)) {
		displayTags += buildTag('license',record.use_terms,false,'Use Terms and Conditions');
	}

	if (checkExists(record.daterange)) {
		displayTags += buildTag('datasetTimeInterval',record.daterange,false,'Date Range of Content');
	}

	if (record.keywords.length > 0) {
		console.log(record.keywords);
		var keywordsTag = record.keywords[0];
		var keywordsList = '\t\t\t<dt>Keywords:</dt>\n\t\t\t<dd><b>\n\t\t\t\t<ul>\n\t\t\t\t\t<li>' + buildSpan('keywords',record.keywords[0]) + '</li>\n';
		for (var c = 1; c < record.keywords.length; c++) {
			if (record.keywords[c] !== '') {
				keywordsTag += ', ' + record.keywords[c];
				keywordsList += '\t\t\t\t\t<li itemprop="keywords">' + record.keywords[c] + '</li>\n';
			}
		}
		keywordsList += '\t\t\t\t</ul>\n\t\t\t</b></dd>\n';
		displayTags += keywordsList;
	}

	if (checkExists(record.fast) && record.fast.length > 0) {
		var FASTList = '\t\t\t<dt>FAST:</dt>\n\t\t\t<dd><b>\n\t\t\t\t<ul>\n';
		for (var c = 0; c < record.fast.length; c++) {
			if (record.fast[c][0] != '') {
				FASTList += '\t\t\t\t\t<li itemprop="about" href="http://id.worldcat.org/fast/' + record.fast[c][1] + '">' + record.fast[c][0] + '</li>\n';
			}
		}
		FASTList += '\t\t\t\t</ul>\n\t\t\t</b></dd>\n';
		displayTags += FASTList;
	}

	displayTags += '\t\t\t<div itemprop="offers" itemscope itemtype="http://schema.org/Offer">\n\t\t\t\t<dt>Located At:</dt>\n\t\t\t\t<dd><b><span itemprop="seller" href="' + institution_info['html']['url'] + '">' + institution_info['html']['name'] + '</span></b></dd>\n\t\t\t</div>\n'; 

	var text = '<!DOCTYPE html>\n<html>\n<head>\n	<meta charset="utf-8">\n</head>\n\n<body>\n\t<div itemscope itemtype="http://schema.org/Dataset">\n' + metaTags + '\t\t<dl>\n' + displayTags + '\t\t</dl>\n\t</div>\n</body>\n</html>';
	downloadFile(text,'html');
}