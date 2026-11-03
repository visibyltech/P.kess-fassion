export interface NigerianStateData {
  name: string;
  deliveryFee: number;
  deliveryDays: string;
  lgas: string[];
}

export const NIGERIAN_STATES: Record<string, NigerianStateData> = {
  "Delta": {
    name: "Delta",
    deliveryFee: 2500,
    deliveryDays: "Same Day - 24 Hours (Asaba Showroom)",
    lgas: ["Oshimili South (Asaba)", "Oshimili North", "Aniocha South", "Aniocha North", "Ika North-East", "Ika South", "Warri South", "Warri North", "Warri South-West", "Uvwie", "Ughelli North", "Ughelli South", "Sapele", "Ethiope East", "Ethiope West", "Okpe", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Ukwuani", "Patani", "Bomadi", "Burutu"]
  },
  "Lagos": {
    name: "Lagos",
    deliveryFee: 4500,
    deliveryDays: "24 - 48 Hours",
    lgas: ["Ikeja", "Lagos Island", "Eti-Osa (Victoria Island / Lekki)", "Surulere", "Ikorodu", "Alimosho", "Kosofe", "Oshodi-Isolo", "Mushin", "Apapa", "Amuwo-Odofin", "Agege", "Ifako-Ijaiye", "Somolu", "Lagos Mainland", "Badagry", "Epe", "Ibeju-Lekki", "Ojo", "Ajeromi-Ifelodun"]
  },
  "Abuja (FCT)": {
    name: "Abuja (FCT)",
    deliveryFee: 4500,
    deliveryDays: "24 - 48 Hours",
    lgas: ["Abuja Municipal (AMAC)", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Abaji"]
  },
  "Rivers": {
    name: "Rivers",
    deliveryFee: 4000,
    deliveryDays: "24 - 48 Hours",
    lgas: ["Port Harcourt", "Obio-Akpor", "Eleme", "Ikwerre", "Oyigbo", "Okrika", "Degema", "Bonny", "Ahoada East", "Ahoada West", "Etche", "Gokana", "Khana", "Tai"]
  },
  "Anambra": {
    name: "Anambra",
    deliveryFee: 3000,
    deliveryDays: "Same Day - 24 Hours (Close to Asaba)",
    lgas: ["Onitsha North", "Onitsha South", "Awka North", "Awka South", "Idemili North", "Idemili South", "Nnewi North", "Nnewi South", "Ogbaru", "Aguata", "Anaocha", "Dunukofia", "Njikoka", "Oyi", "Ihiala"]
  },
  "Edo": {
    name: "Edo",
    deliveryFee: 3500,
    deliveryDays: "24 Hours",
    lgas: ["Oredo (Benin City)", "Ikpoba-Okha", "Egor", "Uhunmwonde", "Ovia North-East", "Ovia South-West", "Esan West", "Esan Central", "Esan North-East", "Etsako West", "Etsako Central"]
  },
  "Enugu": {
    name: "Enugu",
    deliveryFee: 3500,
    deliveryDays: "24 - 48 Hours",
    lgas: ["Enugu North", "Enugu South", "Enugu East", "Nkanu West", "Nkanu East", "Nsukka", "Udi", "Oji River", "Ezeagu", "Igbo-Eze North", "Igbo-Eze South"]
  },
  "Imo": {
    name: "Imo",
    deliveryFee: 3500,
    deliveryDays: "24 - 48 Hours",
    lgas: ["Owerri Municipal", "Owerri North", "Owerri West", "Mbaitoli", "Ikeduru", "Orlu", "Okigwe", "Ngor Okpala", "Ohaji/Egbema", "Oguta", "Aboh Mbaise"]
  },
  "Oyo": {
    name: "Oyo",
    deliveryFee: 4500,
    deliveryDays: "2 - 3 Days",
    lgas: ["Ibadan North", "Ibadan South-West", "Ibadan North-East", "Ibadan South-East", "Ibadan North-West", "Oluyole", "Egbeda", "Oyo East", "Ogbomosho North", "Iseyin"]
  },
  "Ogun": {
    name: "Ogun",
    deliveryFee: 4500,
    deliveryDays: "2 - 3 Days",
    lgas: ["Abeokuta South", "Abeokuta North", "Ado-Odo/Ota", "Sagamu", "Ijebu Ode", "Obafemi Owode", "Ifo", "Ikenne"]
  },
  "Akwa Ibom": {
    name: "Akwa Ibom",
    deliveryFee: 4500,
    deliveryDays: "2 - 3 Days",
    lgas: ["Uyo", "Ikot Ekpene", "Eket", "Oron", "Abak", "Ibesikpo Asutan", "Onna"]
  },
  "Cross River": {
    name: "Cross River",
    deliveryFee: 5000,
    deliveryDays: "2 - 3 Days",
    lgas: ["Calabar Municipal", "Calabar South", "Akpabuyo", "Odukpani", "Ikom", "Ogoja", "Obudu"]
  },
  "Kano": {
    name: "Kano",
    deliveryFee: 5500,
    deliveryDays: "3 - 4 Days",
    lgas: ["Kano Municipal", "Fagge", "Dala", "Gwale", "Tarauni", "Nassarawa", "Kumbotso", "Ungogo"]
  },
  "Kaduna": {
    name: "Kaduna",
    deliveryFee: 5500,
    deliveryDays: "3 - 4 Days",
    lgas: ["Kaduna North", "Kaduna South", "Chikun", "Igabi", "Zaria", "Sabon Gari"]
  },
  "Plateau": {
    name: "Plateau",
    deliveryFee: 5500,
    deliveryDays: "3 - 4 Days",
    lgas: ["Jos North", "Jos South", "Jos East", "Barkin Ladi", "Riyom", "Mangu", "Pankshin"]
  },
  "Abia": {
    name: "Abia",
    deliveryFee: 4000,
    deliveryDays: "24 - 48 Hours",
    lgas: ["Aba North", "Aba South", "Umuahia North", "Umuahia South", "Osisioma", "Obingwa", "Ohafia", "Bende"]
  },
  "Bayelsa": {
    name: "Bayelsa",
    deliveryFee: 4500,
    deliveryDays: "2 - 3 Days",
    lgas: ["Yenagoa", "Southern Ijaw", "Sagbama", "Ogbia", "Nembe", "Brass", "Kolokuma/Opokuma", "Ekeremor"]
  },
  "Kwara": {
    name: "Kwara",
    deliveryFee: 5000,
    deliveryDays: "2 - 3 Days",
    lgas: ["Ilorin South", "Ilorin West", "Ilorin East", "Offa", "Oyun", "Ifelodun", "Moro"]
  },
  "Osun": {
    name: "Osun",
    deliveryFee: 4500,
    deliveryDays: "2 - 3 Days",
    lgas: ["Osogbo", "Olorunda", "Ife Central", "Ife East", "Ilesa East", "Ede South"]
  },
  "Ondo": {
    name: "Ondo",
    deliveryFee: 4500,
    deliveryDays: "2 - 3 Days",
    lgas: ["Akure South", "Akure North", "Ondo West", "Owo", "Ikare Akoko", "Ore"]
  },
  "Benue": {
    name: "Benue",
    deliveryFee: 5000,
    deliveryDays: "2 - 3 Days",
    lgas: ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala", "Gwer East", "Vandeikya"]
  },
  "Kogi": {
    name: "Kogi",
    deliveryFee: 4500,
    deliveryDays: "2 - 3 Days",
    lgas: ["Lokoja", "Okene", "Adavi", "Ajaokuta", "Ankpa", "Dekina", "Kabba/Bunu"]
  },
  "Niger": {
    name: "Niger",
    deliveryFee: 5000,
    deliveryDays: "3 - 4 Days",
    lgas: ["Minna (Chanchaga)", "Suleja", "Bida", "Kontagora", "Mokwa", "Shiroro"]
  },
  "Nasarawa": {
    name: "Nasarawa",
    deliveryFee: 5000,
    deliveryDays: "2 - 3 Days",
    lgas: ["Lafia", "Karu", "Keffi", "Akwanga", "Doma", "Nasarawa"]
  },
  "Ebonyi": {
    name: "Ebonyi",
    deliveryFee: 4000,
    deliveryDays: "24 - 48 Hours",
    lgas: ["Abakaliki", "Afikpo North", "Ezza North", "Ikwo", "Ishielu", "Ohaozara"]
  },
  "Ekiti": {
    name: "Ekiti",
    deliveryFee: 4500,
    deliveryDays: "2 - 3 Days",
    lgas: ["Ado Ekiti", "Ikere", "Ijero", "Oye", "Gbonyin", "Efon"]
  },
  "Bauchi": {
    name: "Bauchi",
    deliveryFee: 6000,
    deliveryDays: "3 - 5 Days",
    lgas: ["Bauchi", "Katagum", "Misau", "Toro", "Dass", "Alkaleri"]
  },
  "Gombe": {
    name: "Gombe",
    deliveryFee: 6000,
    deliveryDays: "3 - 5 Days",
    lgas: ["Gombe", "Akko", "Yamaltu/Deba", "Kaltungo", "Funakaye"]
  },
  "Adamawa": {
    name: "Adamawa",
    deliveryFee: 6000,
    deliveryDays: "3 - 5 Days",
    lgas: ["Yola North", "Yola South", "Mubi North", "Mubi South", "Numan", "Jimeta"]
  },
  "Taraba": {
    name: "Taraba",
    deliveryFee: 6000,
    deliveryDays: "3 - 5 Days",
    lgas: ["Jalingo", "Wukari", "Bali", "Takum", "Sardauna", "Gassol"]
  },
  "Borno": {
    name: "Borno",
    deliveryFee: 6500,
    deliveryDays: "4 - 5 Days",
    lgas: ["Maiduguri", "Jere", "Biu", "Hawul", "Bama"]
  },
  "Yobe": {
    name: "Yobe",
    deliveryFee: 6500,
    deliveryDays: "4 - 5 Days",
    lgas: ["Damaturu", "Potiskum", "Gashua", "Nguru", "Geidam"]
  },
  "Katsina": {
    name: "Katsina",
    deliveryFee: 6000,
    deliveryDays: "3 - 5 Days",
    lgas: ["Katsina", "Daura", "Funtua", "Malumfashi", "Kankia"]
  },
  "Sokoto": {
    name: "Sokoto",
    deliveryFee: 6500,
    deliveryDays: "4 - 5 Days",
    lgas: ["Sokoto North", "Sokoto South", "Wamakko", "Tambuwal", "Goronyo"]
  },
  "Kebbi": {
    name: "Kebbi",
    deliveryFee: 6500,
    deliveryDays: "4 - 5 Days",
    lgas: ["Birnin Kebbi", "Argungu", "Yauri", "Zuru", "Jega"]
  },
  "Zamfara": {
    name: "Zamfara",
    deliveryFee: 6500,
    deliveryDays: "4 - 5 Days",
    lgas: ["Gusau", "Kaura Namoda", "Talata Mafara", "Anka", "Maru"]
  },
  "Jigawa": {
    name: "Jigawa",
    deliveryFee: 6000,
    deliveryDays: "3 - 5 Days",
    lgas: ["Dutse", "Hadejia", "Kazaure", "Gumel", "Ringim"]
  }
};
