// Bank soal Kurikulum Merdeka (SD: Fase A-C · SMP: Fase D · SMA: Fase F & F+; Fase E terpisah di lib/dunia.ts), 41 topik, 5 soal/topik.
// Ditulis + diverifikasi kebenarannya lewat pipeline multi-agen (tulis -> guru cek).
// (SMA Fase E ada terpisah di lib/dunia.ts sebagai Dunia demo utama.)

export type SoalItem = { soal: string; jawaban: string; pembahasan: string };

export type TopikSoal = {
  id: string;
  jenjang: string;
  fase: string;
  bidang: string;
  topik: string;
  judul: string;
  blurb: string;
  xp: number;
  soal: SoalItem[];
};

export const bankSoal: TopikSoal[] = [
  {
    "id": "sd-a-bilangan-100",
    "jenjang": "SD",
    "fase": "Fase A",
    "bidang": "Bilangan",
    "topik": "Bilangan cacah 0 sampai 100",
    "judul": "Mengenal Bilangan Cacah 0-100",
    "blurb": "Yuk berhitung dan mengenal angka dari 0 sampai 100 dengan cara yang seru!",
    "xp": 25,
    "soal": [
      {
        "soal": "Beni menghitung apel di meja: satu, dua, tiga, empat, lima. Ada berapa apel Beni?",
        "jawaban": "5",
        "pembahasan": "Hitung apel satu per satu sampai selesai: 1, 2, 3, 4, 5. Bilangan terakhir yang disebut adalah banyaknya apel, yaitu 5."
      },
      {
        "soal": "Bilangan yang tepat setelah 9 adalah ...",
        "jawaban": "10",
        "pembahasan": "Saat berhitung naik, sesudah 9 kita menyebut 10. Jadi bilangan setelah 9 adalah 10."
      },
      {
        "soal": "Manakah bilangan yang lebih besar, 15 atau 12?",
        "jawaban": "15",
        "pembahasan": "Bandingkan puluhannya sama-sama 1. Lalu lihat satuannya: 5 lebih besar dari 2. Jadi 15 lebih besar dari 12."
      },
      {
        "soal": "Urutkan bilangan berikut dari yang paling kecil: 24, 8, 17.",
        "jawaban": "8, 17, 24",
        "pembahasan": "Bilangan 8 hanya satuan, paling kecil. Lalu 17 dan 24 sama-sama puluhan; 17 lebih kecil dari 24. Urutan dari kecil ke besar: 8, 17, 24."
      },
      {
        "soal": "Bilangan 47 tersusun dari berapa puluhan dan berapa satuan?",
        "jawaban": "4 puluhan dan 7 satuan",
        "pembahasan": "Pada bilangan 47, angka 4 berada di tempat puluhan dan angka 7 berada di tempat satuan. Jadi 47 = 4 puluhan + 7 satuan (40 + 7)."
      }
    ]
  },
  {
    "id": "sd-a-penjumlahan",
    "jenjang": "SD",
    "fase": "Fase A",
    "bidang": "Bilangan",
    "topik": "Penjumlahan puluhan & satuan (dengan menyimpan)",
    "judul": "Penjumlahan Puluhan & Satuan",
    "blurb": "Yuk berlatih menjumlah, mulai dari kolom satuan, lalu belajar menyimpan!",
    "xp": 20,
    "soal": [
      {
        "soal": "Hitunglah 24 + 3 = ...",
        "jawaban": "27",
        "pembahasan": "Angka 24 = 2 puluhan dan 4 satuan. Tambahkan pada satuannya: 4 + 3 = 7. Puluhan tetap 2. Jadi hasilnya 27."
      },
      {
        "soal": "Hitunglah 31 + 25 = ...",
        "jawaban": "56",
        "pembahasan": "Jumlahkan satuan: 1 + 5 = 6. Jumlahkan puluhan: 3 + 2 = 5 (artinya 50). Gabungkan 50 dan 6 menjadi 56."
      },
      {
        "soal": "Hitunglah 28 + 16 = ...",
        "jawaban": "44",
        "pembahasan": "Jumlahkan satuan: 8 + 6 = 14. Karena lebih dari 9, tulis 4 satuan dan simpan 1 puluhan. Jumlahkan puluhan: 2 + 1 + 1 simpanan = 4 (artinya 40). Gabungkan 40 dan 4 menjadi 44."
      },
      {
        "soal": "Hitunglah 37 + 25 = ...",
        "jawaban": "62",
        "pembahasan": "Jumlahkan satuan: 7 + 5 = 12. Karena lebih dari 9, tulis 2 satuan dan simpan 1 puluhan. Jumlahkan puluhan: 3 + 2 + 1 simpanan = 6 (artinya 60). Gabungkan 60 dan 2 menjadi 62."
      },
      {
        "soal": "Sari punya 26 stiker. Ibu memberi 18 stiker lagi. Berapa stiker Sari sekarang?",
        "jawaban": "44 stiker",
        "pembahasan": "Jumlahkan satuan: 6 + 8 = 14. Karena lebih dari 9, tulis 4 satuan dan simpan 1 puluhan. Jumlahkan puluhan: 2 + 1 + 1 simpanan = 4 (artinya 40). Gabungkan 40 dan 4 menjadi 44. Jadi stiker Sari sekarang 44."
      }
    ]
  },
  {
    "id": "sd-a-pengurangan",
    "jenjang": "SD",
    "fase": "Fase A",
    "bidang": "Bilangan",
    "topik": "Pengurangan puluhan & satuan (dengan meminjam)",
    "judul": "Pengurangan Puluhan & Satuan",
    "blurb": "Yuk berlatih mengurang, mulai dari kolom satuan, lalu belajar meminjam!",
    "xp": 20,
    "soal": [
      {
        "soal": "Hitunglah 47 - 12 = ...",
        "jawaban": "35",
        "pembahasan": "Kurangi satuan: 7 - 2 = 5. Kurangi puluhan: 4 - 1 = 3 (artinya 30). Gabungkan 30 dan 5 menjadi 35."
      },
      {
        "soal": "Hitunglah 58 - 23 = ...",
        "jawaban": "35",
        "pembahasan": "Kurangi satuan: 8 - 3 = 5. Kurangi puluhan: 5 - 2 = 3 (artinya 30). Gabungkan 30 dan 5 menjadi 35."
      },
      {
        "soal": "Hitunglah 52 - 28 = ...",
        "jawaban": "24",
        "pembahasan": "Satuan 2 tidak cukup dikurangi 8, maka pinjam 1 puluhan dari 5 puluhan. Satuan menjadi 12, lalu 12 - 8 = 4. Puluhan sisa 4, lalu 4 - 2 = 2 (artinya 20). Gabungkan 20 dan 4 menjadi 24."
      },
      {
        "soal": "Hitunglah 63 - 27 = ...",
        "jawaban": "36",
        "pembahasan": "Satuan 3 tidak cukup dikurangi 7, maka pinjam 1 puluhan dari 6 puluhan. Satuan menjadi 13, lalu 13 - 7 = 6. Puluhan sisa 5, lalu 5 - 2 = 3 (artinya 30). Gabungkan 30 dan 6 menjadi 36."
      },
      {
        "soal": "Budi punya 45 kelereng. Ia memberikan 18 kelereng kepada temannya. Berapa sisa kelereng Budi?",
        "jawaban": "27 kelereng",
        "pembahasan": "Kurangi satuan: 5 - 8 tidak bisa, jadi pinjam 1 puluhan dari 4 puluhan. Satuan menjadi 15 - 8 = 7. Puluhan sisa 3, lalu 3 - 1 = 2 (artinya 20). Gabungkan 20 dan 7 menjadi 27. Jadi sisa kelereng Budi 27."
      }
    ]
  },
  {
    "id": "sd-a-pola",
    "jenjang": "SD",
    "fase": "Fase A",
    "bidang": "Aljabar",
    "topik": "Pola gambar & pola angka sederhana",
    "judul": "Pola Gambar & Pola Angka Sederhana",
    "blurb": "Yuk cari tahu benda dan angka berikutnya dengan mengamati pola yang berulang, seru banget!",
    "xp": 25,
    "soal": [
      {
        "soal": "Perhatikan pola gambar ini: bintang, bulan, bintang, bulan, bintang, ... Gambar apa yang muncul berikutnya?",
        "jawaban": "bulan",
        "pembahasan": "Polanya selang-seling bintang lalu bulan. Setelah bintang selalu bulan, jadi berikutnya adalah bulan."
      },
      {
        "soal": "Lengkapi pola angka ini: 1, 2, 3, 4, ... Angka berapa berikutnya?",
        "jawaban": "5",
        "pembahasan": "Setiap angka bertambah 1. Dari 4 ditambah 1 hasilnya 5."
      },
      {
        "soal": "Perhatikan pola angka ini: 2, 4, 6, 8, ... Angka berapa berikutnya?",
        "jawaban": "10",
        "pembahasan": "Angka melompat naik 2 setiap kali (2, 4, 6, 8). Dari 8 ditambah 2 hasilnya 10."
      },
      {
        "soal": "Isi kotak kosong pada pola ini: 5, 10, __, 20, 25. Angka berapa yang tepat untuk kotak kosong?",
        "jawaban": "15",
        "pembahasan": "Angka bertambah 5 setiap kali. Setelah 10 ditambah 5 hasilnya 15, lalu 15 ditambah 5 hasilnya 20. Jadi kotak kosong berisi 15."
      },
      {
        "soal": "Andi menyusun lingkaran seperti ini: baris ke-1 ada 1 lingkaran, baris ke-2 ada 3 lingkaran, baris ke-3 ada 5 lingkaran, baris ke-4 ada 7 lingkaran. Berapa lingkaran pada baris ke-5?",
        "jawaban": "9",
        "pembahasan": "Jumlah lingkaran bertambah 2 setiap baris (1, 3, 5, 7). Dari 7 ditambah 2 hasilnya 9 lingkaran pada baris ke-5."
      }
    ]
  },
  {
    "id": "sd-a-ukur-takbaku",
    "jenjang": "SD",
    "fase": "Fase A",
    "bidang": "Pengukuran",
    "topik": "Pengukuran panjang & berat satuan tidak baku (jengkal, depa)",
    "judul": "Mengukur dengan Jengkal & Depa",
    "blurb": "Yuk, ukur benda di sekitarmu pakai jengkal, depa, dan tangan, seru dan mudah!",
    "xp": 25,
    "soal": [
      {
        "soal": "Saat tangan dibentangkan, jarak dari ujung ibu jari sampai ujung jari kelingking disebut satu ...?",
        "jawaban": "jengkal",
        "pembahasan": "Bentangan tangan dari ibu jari ke jari kelingking disebut satu jengkal. Jengkal adalah satuan tidak baku untuk mengukur panjang."
      },
      {
        "soal": "Bu Guru mengukur dua tali. Tali pertama panjangnya 3 depa dan tali kedua panjangnya 6 depa. Tali mana yang lebih panjang?",
        "jawaban": "Tali kedua",
        "pembahasan": "Bandingkan angkanya: 6 depa lebih banyak daripada 3 depa, jadi tali kedua lebih panjang."
      },
      {
        "soal": "Berat sebuah buku sama dengan 5 kelereng. Berat sebuah tempat pensil sama dengan 8 kelereng. Benda mana yang lebih berat?",
        "jawaban": "Tempat pensil",
        "pembahasan": "8 kelereng lebih banyak daripada 5 kelereng, jadi tempat pensil lebih berat daripada buku."
      },
      {
        "soal": "Udin mengukur panjang meja dengan jengkal. Bagian kiri 4 jengkal dan bagian kanan 5 jengkal. Berapa jengkal panjang meja seluruhnya?",
        "jawaban": "9 jengkal",
        "pembahasan": "Jumlahkan kedua bagian: 4 jengkal + 5 jengkal = 9 jengkal."
      },
      {
        "soal": "Ayah dan Ani mengukur karpet yang sama pakai jengkal. Ayah mendapat 6 jengkal, tetapi Ani mendapat 9 jengkal. Mengapa hasilnya berbeda?",
        "jawaban": "Karena ukuran jengkal (tangan) Ayah lebih besar daripada jengkal Ani",
        "pembahasan": "Jengkal adalah satuan tidak baku, ukuran tangan tiap orang berbeda. Tangan Ayah lebih besar sehingga jumlah jengkalnya lebih sedikit (6), tangan Ani lebih kecil sehingga jumlah jengkalnya lebih banyak (9), walaupun karpet yang diukur sama."
      }
    ]
  },
  {
    "id": "sd-a-waktu",
    "jenjang": "SD",
    "fase": "Fase A",
    "bidang": "Pengukuran",
    "topik": "Membaca waktu pada jam analog",
    "judul": "Yuk, Membaca Jam Analog!",
    "blurb": "Kenali jarum pendek dan jarum panjang supaya kamu tahu sekarang pukul berapa!",
    "xp": 25,
    "soal": [
      {
        "soal": "Pada sebuah jam, jarum pendek menunjuk angka 3 dan jarum panjang menunjuk angka 12. Pukul berapa yang ditunjukkan jam itu?",
        "jawaban": "Pukul 3 tepat (03.00)",
        "pembahasan": "Jarum panjang di angka 12 artinya waktunya tepat (menit 00). Jarum pendek menunjukkan jam, yaitu di angka 3. Jadi pukul 3 tepat."
      },
      {
        "soal": "Rina sarapan pagi saat jarum panjang jam menunjuk angka 12 dan jarum pendek menunjuk angka 6. Pukul berapa Rina sarapan?",
        "jawaban": "Pukul 6 tepat (06.00)",
        "pembahasan": "Jarum panjang di angka 12 berarti tepat. Jarum pendek ada di angka 6, jadi jamnya 6. Rina sarapan pukul 6 tepat."
      },
      {
        "soal": "Sebuah jam menunjukkan jarum panjang di angka 6 dan jarum pendek berada di antara angka 4 dan 5. Pukul berapa yang ditunjukkan jam itu?",
        "jawaban": "Pukul setengah 5 (04.30)",
        "pembahasan": "Jarum panjang di angka 6 berarti sudah lewat setengah jam atau 30 menit. Jarum pendek di antara 4 dan 5 berarti jamnya masih 4. Jadi pukul 4 lewat 30 menit, disebut juga setengah 5."
      },
      {
        "soal": "Sebuah jam menunjukkan pukul setengah 8. Di angka berapakah jarum panjang menunjuk?",
        "jawaban": "Angka 6",
        "pembahasan": "Setengah jam sama dengan 30 menit. Dari angka 12, jarum panjang bergerak setengah lingkaran dan berhenti di angka 6. Jadi saat setengah 8 (07.30), jarum panjang menunjuk angka 6."
      },
      {
        "soal": "Doni mulai belajar pukul 3 tepat dan selesai pukul setengah 4. Berapa lama Doni belajar?",
        "jawaban": "30 menit (setengah jam)",
        "pembahasan": "Pukul 3 tepat sama dengan 03.00. Pukul setengah 4 sama dengan 03.30. Dari 03.00 ke 03.30 selisihnya 30 menit. Jadi Doni belajar selama 30 menit."
      }
    ]
  },
  {
    "id": "sd-a-bangun",
    "jenjang": "SD",
    "fase": "Fase A",
    "bidang": "Geometri",
    "topik": "Pengenalan bangun datar & bangun ruang",
    "judul": "Kenalan dengan Bangun Datar & Bangun Ruang",
    "blurb": "Yuk kenalan dengan bentuk-bentuk di sekitar kita, dari lingkaran jam sampai kotak kado!",
    "xp": 25,
    "soal": [
      {
        "soal": "Permukaan jam dinding yang bundar berbentuk bangun datar apa?",
        "jawaban": "Lingkaran",
        "pembahasan": "Bentuk yang bundar dan tidak punya sudut namanya lingkaran. Jam dinding bundar berbentuk lingkaran."
      },
      {
        "soal": "Bangun datar yang mempunyai 3 sisi dan 3 sudut disebut bangun apa?",
        "jawaban": "Segitiga",
        "pembahasan": "Hitung sisinya: ada 3 sisi dan 3 sudut. Bangun datar dengan 3 sisi bernama segitiga."
      },
      {
        "soal": "Papan tulis di kelas berbentuk persegi panjang. Ada berapa banyak sisi pada persegi panjang?",
        "jawaban": "4 sisi",
        "pembahasan": "Persegi panjang punya sisi atas, bawah, kiri, dan kanan. Kalau dihitung ada 4 sisi."
      },
      {
        "soal": "Sebuah dadu berbentuk kotak. Dadu termasuk bangun datar atau bangun ruang?",
        "jawaban": "Bangun ruang",
        "pembahasan": "Bangun datar itu tipis dan rata seperti gambar, contohnya persegi. Dadu bisa dipegang dan punya isi (tebal), jadi dadu adalah bangun ruang. Bentuk dadu disebut kubus."
      },
      {
        "soal": "Dita menggambar 2 segitiga dan 1 persegi. Berapa jumlah semua sisi dari gambar-gambar Dita?",
        "jawaban": "10 sisi",
        "pembahasan": "Segitiga punya 3 sisi. Dua segitiga = 3 + 3 = 6 sisi. Persegi punya 4 sisi. Jumlahkan semua: 6 + 4 = 10 sisi."
      }
    ]
  },
  {
    "id": "sd-a-data",
    "jenjang": "SD",
    "fase": "Fase A",
    "bidang": "Data & Peluang",
    "topik": "Pengelompokan data sederhana",
    "judul": "Yuk, Kelompokkan Data!",
    "blurb": "Belajar seru mengelompokkan benda dan menghitung banyaknya, seperti merapikan mainan menurut jenisnya!",
    "xp": 22,
    "soal": [
      {
        "soal": "Di dalam keranjang ada buah: apel, apel, jeruk, apel, jeruk. Kalau dikelompokkan menurut jenisnya, ada berapa kelompok buah?",
        "jawaban": "2 kelompok",
        "pembahasan": "Lihat jenis buahnya: ada apel dan ada jeruk. Jenisnya ada 2 macam, jadi ada 2 kelompok."
      },
      {
        "soal": "Perhatikan gambar hewan: kucing, kucing, anjing, kucing, ikan. Ada berapa ekor kucing?",
        "jawaban": "3 ekor",
        "pembahasan": "Hitung yang bertuliskan kucing satu per satu: kucing (1), kucing (2), kucing (3). Jadi ada 3 ekor kucing."
      },
      {
        "soal": "Warna baju teman sekelompok: merah, biru, merah, merah, biru. Warna baju apa yang paling banyak?",
        "jawaban": "Merah",
        "pembahasan": "Kelompokkan menurut warna: merah ada 3, biru ada 2. Karena 3 lebih banyak dari 2, warna yang paling banyak adalah merah."
      },
      {
        "soal": "Bu Guru mencatat mainan: bola, boneka, bola, mobil, boneka, bola, mobil. Kelompok mainan mana yang jumlahnya sama banyak?",
        "jawaban": "Boneka dan mobil (masing-masing 2)",
        "pembahasan": "Hitung tiap kelompok: bola ada 3, boneka ada 2, mobil ada 2. Yang jumlahnya sama adalah boneka dan mobil, sama-sama 2."
      },
      {
        "soal": "Anak-anak memilih buah kesukaan: pisang 6 anak, mangga 4 anak, semangka 2 anak. Berapa selisih jumlah anak yang suka pisang dan yang suka semangka?",
        "jawaban": "4 anak",
        "pembahasan": "Suka pisang ada 6 anak, suka semangka ada 2 anak. Selisihnya = 6 - 2 = 4 anak."
      }
    ]
  },
  {
    "id": "sd-b-bilangan-10000",
    "jenjang": "SD",
    "fase": "Fase B",
    "bidang": "Bilangan",
    "topik": "Bilangan cacah sampai 10.000",
    "judul": "Bilangan Cacah sampai 10.000",
    "blurb": "Yuk, kenali dan mainkan bilangan besar sampai 10.000 dengan cara yang seru!",
    "xp": 30,
    "soal": [
      {
        "soal": "Bilangan \"dua ribu lima ratus\" jika ditulis dengan angka menjadi berapa?",
        "jawaban": "2.500",
        "pembahasan": "Dua ribu = 2.000, lima ratus = 500. Digabung menjadi 2.000 + 500 = 2.500."
      },
      {
        "soal": "Pada bilangan 4.762, angka 4 menempati nilai tempat apa?",
        "jawaban": "Ribuan",
        "pembahasan": "Urutan nilai tempat dari kanan: 2 satuan, 6 puluhan, 7 ratusan, dan 4 ribuan. Jadi angka 4 ada di tempat ribuan."
      },
      {
        "soal": "Manakah yang lebih besar, 6.318 atau 6.381? Tulis jawabanmu.",
        "jawaban": "6.381",
        "pembahasan": "Ribuan sama (6) dan ratusan sama (3). Bandingkan puluhan: 8 lebih besar dari 1, jadi 6.381 lebih besar dari 6.318."
      },
      {
        "soal": "Urutkan bilangan berikut dari yang terkecil: 5.240, 5.024, 5.402.",
        "jawaban": "5.024, 5.240, 5.402",
        "pembahasan": "Ribuan sama (5). Bandingkan ratusan: 5.024 (0), 5.240 (2), 5.402 (4). Dari ratusan terkecil ke terbesar: 5.024, 5.240, 5.402."
      },
      {
        "soal": "Susun bilangan terbesar yang terdiri dari 4 angka menggunakan angka 7, 2, 9, dan 4 (setiap angka dipakai satu kali).",
        "jawaban": "9.742",
        "pembahasan": "Agar terbesar, letakkan angka paling besar di depan. Urutkan dari besar ke kecil: 9, 7, 4, 2. Jadi bilangannya 9.742."
      }
    ]
  },
  {
    "id": "sd-b-kali-bagi",
    "jenjang": "SD",
    "fase": "Fase B",
    "bidang": "Bilangan",
    "topik": "Perkalian & pembagian bilangan cacah",
    "judul": "Perkalian & Pembagian Bilangan Cacah",
    "blurb": "Ayo berlatih mengali dan membagi lewat cerita seru sehari-hari!",
    "xp": 30,
    "soal": [
      {
        "soal": "Hitunglah hasil dari 8 x 3.",
        "jawaban": "24",
        "pembahasan": "8 x 3 berarti menjumlahkan 8 sebanyak 3 kali: 8 + 8 + 8 = 24."
      },
      {
        "soal": "Hitunglah hasil dari 36 : 4.",
        "jawaban": "9",
        "pembahasan": "Cari bilangan yang jika dikali 4 hasilnya 36. Karena 4 x 9 = 36, maka 36 : 4 = 9."
      },
      {
        "soal": "Satu kantong berisi 12 permen. Ibu membeli 5 kantong. Berapa jumlah semua permen?",
        "jawaban": "60 permen",
        "pembahasan": "Jumlah permen = banyak kantong x isi tiap kantong = 5 x 12 = 60 permen."
      },
      {
        "soal": "Ada 48 buku dibagikan sama rata kepada 6 anak. Berapa buku yang diterima setiap anak?",
        "jawaban": "8 buku",
        "pembahasan": "Bagi rata seluruh buku: 48 : 6 = 8, jadi setiap anak menerima 8 buku."
      },
      {
        "soal": "Andi membeli 4 kotak kue. Setiap kotak berisi 9 kue. Semua kue dibagikan sama rata kepada 6 teman. Berapa kue yang diterima setiap teman?",
        "jawaban": "6 kue",
        "pembahasan": "Langkah 1: cari total kue = 4 x 9 = 36 kue. Langkah 2: bagi rata ke 6 teman = 36 : 6 = 6 kue tiap teman."
      }
    ]
  },
  {
    "id": "sd-b-pecahan-senilai",
    "jenjang": "SD",
    "fase": "Fase B",
    "bidang": "Bilangan",
    "topik": "Pecahan senilai & membandingkan pecahan",
    "judul": "Pecahan Senilai & Membandingkan Pecahan",
    "blurb": "Yuk cari pecahan yang nilainya sama dan cari tahu mana yang lebih besar dengan cara seru!",
    "xp": 30,
    "soal": [
      {
        "soal": "Lengkapi pecahan senilai berikut: 1/2 = .../4",
        "jawaban": "2/4",
        "pembahasan": "Penyebut dari 2 menjadi 4 berarti dikali 2. Pembilang juga dikali 2: 1 x 2 = 2. Jadi 1/2 = 2/4."
      },
      {
        "soal": "Manakah yang lebih besar, 3/5 atau 2/5?",
        "jawaban": "3/5",
        "pembahasan": "Penyebutnya sama (sama-sama 5), jadi cukup bandingkan pembilang. Karena 3 lebih besar dari 2, maka 3/5 lebih besar."
      },
      {
        "soal": "Lengkapi pecahan senilai berikut: 2/3 = .../9",
        "jawaban": "6/9",
        "pembahasan": "Penyebut dari 3 menjadi 9 berarti dikali 3. Pembilang juga dikali 3: 2 x 3 = 6. Jadi 2/3 = 6/9."
      },
      {
        "soal": "Sinta makan 1/2 potong roti, sedangkan Doni makan 1/3 potong roti yang sama besar. Siapa yang makan lebih banyak?",
        "jawaban": "Sinta (1/2)",
        "pembahasan": "Samakan penyebut menjadi 6: 1/2 = 3/6 dan 1/3 = 2/6. Karena 3/6 lebih besar dari 2/6, maka Sinta makan lebih banyak."
      },
      {
        "soal": "Ibu punya dua kue sama besar. Andi menghabiskan 2/3 bagian kue cokelat dan Budi menghabiskan 3/4 bagian kue keju. Siapa yang makan lebih banyak?",
        "jawaban": "Budi (3/4)",
        "pembahasan": "Samakan penyebut menjadi 12: 2/3 = 8/12 dan 3/4 = 9/12. Karena 9/12 lebih besar dari 8/12, maka Budi makan lebih banyak."
      }
    ]
  },
  {
    "id": "sd-b-uang",
    "jenjang": "SD",
    "fase": "Fase B",
    "bidang": "Bilangan",
    "topik": "Nilai mata uang",
    "judul": "Mengenal Nilai Mata Uang",
    "blurb": "Yuk belajar menghitung uang seperti saat jajan di kantin sekolah!",
    "xp": 30,
    "soal": [
      {
        "soal": "Beni memiliki 3 keping uang logam seribu rupiah. Berapa jumlah uang Beni seluruhnya?",
        "jawaban": "Rp3.000",
        "pembahasan": "Nilai 1 keping = Rp1.000. Ada 3 keping, jadi 1.000 x 3 = 3.000. Totalnya Rp3.000."
      },
      {
        "soal": "Dina mempunyai 1 lembar uang lima ribuan dan 1 lembar uang dua ribuan. Berapa jumlah uang Dina?",
        "jawaban": "Rp7.000",
        "pembahasan": "Jumlahkan kedua uang: 5.000 + 2.000 = 7.000. Jadi uang Dina Rp7.000."
      },
      {
        "soal": "Sari memiliki 1 lembar uang sepuluh ribuan. Tono memiliki 2 lembar uang lima ribuan dan 1 keping uang seribuan. Uang siapa yang lebih banyak?",
        "jawaban": "Uang Tono lebih banyak",
        "pembahasan": "Uang Sari = 10.000. Uang Tono = (5.000 x 2) + 1.000 = 10.000 + 1.000 = 11.000. Karena 11.000 lebih besar dari 10.000, uang Tono lebih banyak."
      },
      {
        "soal": "Rani menerima 2 lembar uang lima ribuan, 3 keping uang seribuan, dan 2 keping uang lima ratusan. Berapa total uang Rani?",
        "jawaban": "Rp14.000",
        "pembahasan": "Hitung tiap jenis: (5.000 x 2) = 10.000; (1.000 x 3) = 3.000; (500 x 2) = 1.000. Lalu jumlahkan: 10.000 + 3.000 + 1.000 = 14.000. Total Rp14.000."
      },
      {
        "soal": "Udin membeli pensil seharga Rp3.500 dan penghapus seharga Rp2.000. Ia membayar dengan 1 lembar uang sepuluh ribuan. Berapa uang kembalian yang Udin terima?",
        "jawaban": "Rp4.500",
        "pembahasan": "Hitung dulu total belanja: 3.500 + 2.000 = 5.500. Lalu kurangi uang bayar: 10.000 - 5.500 = 4.500. Kembaliannya Rp4.500."
      }
    ]
  },
  {
    "id": "sd-b-ukur-baku",
    "jenjang": "SD",
    "fase": "Fase B",
    "bidang": "Pengukuran",
    "topik": "Pengukuran panjang & berat satuan baku (meter, gram)",
    "judul": "Mengukur Panjang & Berat (Meter dan Gram)",
    "blurb": "Yuk belajar mengukur panjang dan berat benda di sekitarmu pakai satuan meter dan gram!",
    "xp": 30,
    "soal": [
      {
        "soal": "Ibu ingin mengetahui berat sebuah apel. Satuan baku yang tepat untuk menimbang apel adalah gram (g) atau kilometer (km)?",
        "jawaban": "gram (g)",
        "pembahasan": "Gram adalah satuan untuk mengukur berat, sedangkan kilometer adalah satuan panjang. Jadi untuk menimbang apel kita pakai gram."
      },
      {
        "soal": "1 meter sama dengan berapa sentimeter?",
        "jawaban": "100 cm",
        "pembahasan": "Satuan baku panjang yang perlu diingat: 1 meter = 100 sentimeter (cm)."
      },
      {
        "soal": "Sebuah tali panjangnya 3 meter. Berapa sentimeter panjang tali itu?",
        "jawaban": "300 cm",
        "pembahasan": "1 m = 100 cm, jadi 3 m = 3 x 100 = 300 cm."
      },
      {
        "soal": "Beni membeli 2 kg tepung dan 500 gram gula. Berapa gram berat seluruh belanjaan Beni?",
        "jawaban": "2.500 gram",
        "pembahasan": "1 kg = 1.000 g, jadi 2 kg = 2.000 g. Total berat = 2.000 + 500 = 2.500 gram."
      },
      {
        "soal": "Sinta punya pita panjang 2 meter. Ia memakai 75 cm untuk membungkus kado dan 40 cm untuk hiasan. Berapa sentimeter pita Sinta yang tersisa?",
        "jawaban": "85 cm",
        "pembahasan": "Ubah dulu: 2 m = 200 cm. Pita terpakai = 75 + 40 = 115 cm. Sisa = 200 - 115 = 85 cm."
      }
    ]
  },
  {
    "id": "sd-b-luas-keliling",
    "jenjang": "SD",
    "fase": "Fase B",
    "bidang": "Geometri",
    "topik": "Luas & keliling bangun datar (persegi, persegi panjang, segitiga)",
    "judul": "Luas & Keliling Bangun Datar",
    "blurb": "Yuk hitung luas dan keliling persegi, persegi panjang, dan segitiga dengan cara yang seru dan mudah!",
    "xp": 30,
    "soal": [
      {
        "soal": "Sebuah persegi mempunyai panjang sisi 5 cm. Berapakah keliling persegi tersebut?",
        "jawaban": "20 cm",
        "pembahasan": "Keliling persegi = 4 x sisi. Maka 4 x 5 = 20 cm."
      },
      {
        "soal": "Sebuah persegi mempunyai panjang sisi 7 cm. Berapakah luas persegi tersebut?",
        "jawaban": "49 cm persegi",
        "pembahasan": "Luas persegi = sisi x sisi. Maka 7 x 7 = 49 cm persegi."
      },
      {
        "soal": "Sebuah persegi panjang mempunyai panjang 8 cm dan lebar 5 cm. Berapakah luasnya?",
        "jawaban": "40 cm persegi",
        "pembahasan": "Luas persegi panjang = panjang x lebar. Maka 8 x 5 = 40 cm persegi."
      },
      {
        "soal": "Sebuah segitiga mempunyai alas 12 cm dan tinggi 6 cm. Berapakah luas segitiga tersebut?",
        "jawaban": "36 cm persegi",
        "pembahasan": "Luas segitiga = (alas x tinggi) : 2. Maka (12 x 6) : 2 = 72 : 2 = 36 cm persegi."
      },
      {
        "soal": "Kebun Pak Andi berbentuk persegi panjang dengan panjang 10 m dan lebar 6 m. Pak Andi ingin memasang pagar mengelilingi kebun dan menanam rumput di seluruh permukaannya. Berapa panjang pagar (keliling) dan berapa luas kebun yang ditanami rumput?",
        "jawaban": "Keliling 32 m dan luas 60 m persegi",
        "pembahasan": "Keliling = 2 x (panjang + lebar) = 2 x (10 + 6) = 2 x 16 = 32 m. Luas = panjang x lebar = 10 x 6 = 60 m persegi."
      }
    ]
  },
  {
    "id": "sd-b-sudut",
    "jenjang": "SD",
    "fase": "Fase B",
    "bidang": "Geometri",
    "topik": "Sudut siku-siku, lancip, dan tumpul",
    "judul": "Mengenal Sudut: Siku-siku, Lancip, dan Tumpul",
    "blurb": "Yuk kenali tiga jenis sudut di sekitarmu, dari pojok buku sampai jarum jam!",
    "xp": 30,
    "soal": [
      {
        "soal": "Sudut yang besarnya tepat 90 derajat, seperti pojok buku atau ubin, disebut sudut apa?",
        "jawaban": "Sudut siku-siku",
        "pembahasan": "Sudut siku-siku besarnya tepat 90 derajat. Contohnya pojok buku, pojok meja, dan pojok ubin."
      },
      {
        "soal": "Apakah sudut lancip lebih kecil atau lebih besar dari sudut siku-siku?",
        "jawaban": "Lebih kecil",
        "pembahasan": "Sudut lancip besarnya kurang dari 90 derajat, sedangkan sudut siku-siku 90 derajat. Jadi sudut lancip lebih kecil."
      },
      {
        "soal": "Sebuah sudut besarnya 120 derajat. Sudut itu termasuk jenis sudut apa?",
        "jawaban": "Sudut tumpul",
        "pembahasan": "120 derajat lebih besar dari 90 derajat tetapi kurang dari 180 derajat, jadi termasuk sudut tumpul."
      },
      {
        "soal": "Pada pukul 03.00, jarum panjang menunjuk angka 12 dan jarum pendek menunjuk angka 3. Berapa besar sudut yang terbentuk dan termasuk sudut apa?",
        "jawaban": "90 derajat, sudut siku-siku",
        "pembahasan": "Dari angka 12 ke angka 3 pada jam, jarum membentuk sudut 90 derajat. Sudut 90 derajat adalah sudut siku-siku."
      },
      {
        "soal": "Diketahui sudut P = 30 derajat, sudut Q = 90 derajat, dan sudut R = 150 derajat. Tentukan jenis masing-masing sudut.",
        "jawaban": "P lancip, Q siku-siku, R tumpul",
        "pembahasan": "Sudut P = 30 derajat kurang dari 90 derajat, jadi lancip. Sudut Q = 90 derajat, jadi siku-siku. Sudut R = 150 derajat lebih dari 90 derajat dan kurang dari 180 derajat, jadi tumpul."
      }
    ]
  },
  {
    "id": "sd-b-piktogram",
    "jenjang": "SD",
    "fase": "Fase B",
    "bidang": "Data & Peluang",
    "topik": "Penyajian data dengan tabel & piktogram",
    "judul": "Membaca Tabel & Piktogram",
    "blurb": "Yuk jadi detektif data dengan membaca tabel dan gambar-gambar seru!",
    "xp": 30,
    "soal": [
      {
        "soal": "Tabel buah kesukaan siswa: Apel 6, Jeruk 4, Pisang 5. Berapa banyak siswa yang suka Jeruk?",
        "jawaban": "4 siswa",
        "pembahasan": "Cari baris Jeruk pada tabel, lalu lihat angkanya. Angkanya 4, jadi ada 4 siswa yang suka Jeruk."
      },
      {
        "soal": "Piktogram jumlah buku yang dipinjam. Setiap 1 gambar buku mewakili 1 buku. Hari Senin ada 5 gambar buku. Berapa buku dipinjam hari Senin?",
        "jawaban": "5 buku",
        "pembahasan": "Karena 1 gambar = 1 buku, tinggal hitung gambarnya. Ada 5 gambar, jadi 5 x 1 = 5 buku."
      },
      {
        "soal": "Tabel banyak hewan di kebun mini: Kelinci 8 ekor, Ayam 5 ekor. Berapa selisih banyak Kelinci dan Ayam?",
        "jawaban": "3 ekor",
        "pembahasan": "Selisih artinya pengurangan dari yang lebih banyak. Kelinci 8, Ayam 5, jadi 8 - 5 = 3 ekor."
      },
      {
        "soal": "Piktogram hasil panen tomat. Setiap 1 gambar bintang mewakili 2 buah tomat. Jika ada 4 gambar bintang, berapa buah tomat semuanya?",
        "jawaban": "8 tomat",
        "pembahasan": "Setiap gambar bernilai 2, dan ada 4 gambar. Kalikan: 4 x 2 = 8 buah tomat."
      },
      {
        "soal": "Piktogram jumlah pengunjung perpustakaan. Setiap 1 gambar orang mewakili 5 pengunjung. Hari Senin ada 3 gambar dan Selasa ada 2 gambar. Berapa total pengunjung dua hari itu?",
        "jawaban": "25 pengunjung",
        "pembahasan": "Hitung tiap hari dulu: Senin 3 x 5 = 15, Selasa 2 x 5 = 10. Lalu jumlahkan: 15 + 10 = 25 pengunjung."
      }
    ]
  },
  {
    "id": "sd-c-desimal-persen",
    "jenjang": "SD",
    "fase": "Fase C",
    "bidang": "Bilangan",
    "topik": "Bilangan desimal, persen, dan bilangan bulat negatif",
    "judul": "Jago Desimal, Persen & Bilangan Negatif",
    "blurb": "Yuk berlatih desimal, persen, dan bilangan bulat negatif lewat contoh sehari-hari yang seru!",
    "xp": 35,
    "soal": [
      {
        "soal": "Manakah bilangan yang lebih besar, 0,5 atau 0,7?",
        "jawaban": "0,7",
        "pembahasan": "Bagian bulatnya sama-sama 0. Bandingkan angka pertama di belakang koma: 7 lebih besar dari 5. Jadi 0,7 lebih besar dari 0,5."
      },
      {
        "soal": "Berapakah 50% dari 20?",
        "jawaban": "10",
        "pembahasan": "50% berarti setengah (50/100 = 1/2). Setengah dari 20 adalah 20 : 2 = 10."
      },
      {
        "soal": "Ibu membeli 1,5 kg gula dan 0,75 kg tepung. Berapa total berat belanjaan Ibu?",
        "jawaban": "2,25 kg",
        "pembahasan": "Jumlahkan kedua berat. Samakan banyak angka di belakang koma: 1,50 + 0,75 = 2,25. Jadi totalnya 2,25 kg."
      },
      {
        "soal": "Suhu di dalam kulkas mula-mula 5 derajat. Karena tombol diputar, suhunya turun 8 derajat. Berapa suhu kulkas sekarang?",
        "jawaban": "-3 derajat",
        "pembahasan": "Turun 8 derajat berarti dikurangi 8: 5 - 8 = -3. Jadi suhunya menjadi 3 derajat di bawah nol, ditulis -3 derajat."
      },
      {
        "soal": "Sebuah baju berharga Rp50.000 mendapat diskon 20%. Berapa harga baju setelah diskon?",
        "jawaban": "Rp40.000",
        "pembahasan": "Cari dulu potongannya: 20% dari 50.000 = 20/100 x 50.000 = 10.000. Lalu kurangi dari harga awal: 50.000 - 10.000 = 40.000. Jadi harga baju setelah diskon Rp40.000."
      }
    ]
  },
  {
    "id": "sd-c-operasi-campuran",
    "jenjang": "SD",
    "fase": "Fase C",
    "bidang": "Bilangan",
    "topik": "Operasi hitung campuran pecahan & desimal",
    "judul": "Campuran Pecahan & Desimal",
    "blurb": "Yuk berteman dengan pecahan dan desimal, ubah bentuknya lalu hitung bareng-bareng!",
    "xp": 40,
    "soal": [
      {
        "soal": "Hitunglah: 1/2 + 0,3 = ...",
        "jawaban": "0,8",
        "pembahasan": "Ubah pecahan ke desimal dulu: 1/2 = 0,5. Lalu jumlahkan: 0,5 + 0,3 = 0,8."
      },
      {
        "soal": "Hitunglah: 0,75 - 1/4 = ...",
        "jawaban": "0,5",
        "pembahasan": "Ubah 1/4 menjadi desimal: 1/4 = 0,25. Lalu kurangkan: 0,75 - 0,25 = 0,5."
      },
      {
        "soal": "Hitunglah: 1/2 + 1/4 + 0,25 = ...",
        "jawaban": "1",
        "pembahasan": "Ubah pecahan ke desimal: 1/2 = 0,5 dan 1/4 = 0,25. Jumlahkan berurutan: 0,5 + 0,25 = 0,75, lalu 0,75 + 0,25 = 1."
      },
      {
        "soal": "Ibu punya gula 1,5 kg. Untuk membuat kue dipakai 3/4 kg, lalu Ibu membeli lagi 0,5 kg. Berapa kg gula Ibu sekarang?",
        "jawaban": "1,25 kg",
        "pembahasan": "Ubah 3/4 = 0,75. Kurangi gula yang dipakai: 1,5 - 0,75 = 0,75. Tambahkan gula yang dibeli: 0,75 + 0,5 = 1,25 kg."
      },
      {
        "soal": "Hitunglah: 2/5 + 0,5 x 1/2 = ...",
        "jawaban": "0,65",
        "pembahasan": "Kerjakan perkalian lebih dulu: 0,5 x 1/2 = 0,25. Ubah 2/5 = 0,4. Lalu jumlahkan: 0,4 + 0,25 = 0,65."
      }
    ]
  },
  {
    "id": "sd-c-pangkat-akar",
    "jenjang": "SD",
    "fase": "Fase C",
    "bidang": "Bilangan",
    "topik": "Pangkat dua/tiga & akar pangkat dua/tiga",
    "judul": "Pangkat Dua/Tiga & Akarnya",
    "blurb": "Yuk berlatih menghitung pangkat dua, pangkat tiga, dan akarnya dengan cara yang seru!",
    "xp": 30,
    "soal": [
      {
        "soal": "Berapakah hasil dari 3^2 (3 pangkat dua)?",
        "jawaban": "9",
        "pembahasan": "3 pangkat dua artinya 3 dikali 3. Jadi 3 x 3 = 9."
      },
      {
        "soal": "Berapakah akar pangkat dua dari 49, ditulis akar(49)?",
        "jawaban": "7",
        "pembahasan": "Cari bilangan yang jika dikalikan dengan dirinya sendiri hasilnya 49. Karena 7 x 7 = 49, maka akar(49) = 7."
      },
      {
        "soal": "Berapakah hasil dari 2^3 (2 pangkat tiga)?",
        "jawaban": "8",
        "pembahasan": "2 pangkat tiga artinya 2 dikali 2 dikali 2. Jadi 2 x 2 = 4, lalu 4 x 2 = 8."
      },
      {
        "soal": "Sebuah lantai berbentuk persegi ditutupi tepat 144 ubin, dengan jumlah ubin sama banyak di setiap baris dan setiap kolom. Berapa banyak ubin di setiap baris?",
        "jawaban": "12 ubin",
        "pembahasan": "Karena baris dan kolom sama banyak, jumlah baris x jumlah baris = 144. Ini sama dengan akar(144). Karena 12 x 12 = 144, maka setiap baris ada 12 ubin."
      },
      {
        "soal": "Sebuah kotak berbentuk kubus memiliki volume 27 cm kubik. Berapa panjang rusuk (sisi) kotak itu?",
        "jawaban": "3 cm",
        "pembahasan": "Volume kubus = rusuk x rusuk x rusuk, jadi rusuk = akar pangkat tiga dari 27. Cari bilangan yang dipangkatkan tiga hasilnya 27. Karena 3 x 3 x 3 = 27, maka rusuknya 3 cm."
      }
    ]
  },
  {
    "id": "sd-c-rasio-skala",
    "jenjang": "SD",
    "fase": "Fase C",
    "bidang": "Bilangan",
    "topik": "Rasio (perbandingan) & skala",
    "judul": "Rasio & Skala: Membandingkan dan Mengukur",
    "blurb": "Yuk belajar membandingkan banyak benda dan membaca peta lewat perbandingan yang seru!",
    "xp": 35,
    "soal": [
      {
        "soal": "Di sebuah kelas ada 8 anak laki-laki dan 12 anak perempuan. Tuliskan perbandingan banyak anak laki-laki terhadap anak perempuan dalam bentuk paling sederhana.",
        "jawaban": "2 : 3",
        "pembahasan": "Tulis perbandingan 8 : 12. Bagi kedua bilangan dengan FPB-nya, yaitu 4. Hasilnya 8:4 = 2 dan 12:4 = 3, jadi 2 : 3."
      },
      {
        "soal": "Perbandingan banyak kelereng Andi dan Budi adalah 3 : 5. Jika Andi punya 9 kelereng, berapa banyak kelereng Budi?",
        "jawaban": "15 kelereng",
        "pembahasan": "Andi = 3 bagian = 9 kelereng, berarti 1 bagian = 9 : 3 = 3 kelereng. Budi = 5 bagian = 5 x 3 = 15 kelereng."
      },
      {
        "soal": "Sebuah denah rumah dibuat dengan skala 1 : 100. Jika panjang kamar pada denah 5 cm, berapa panjang kamar yang sebenarnya?",
        "jawaban": "500 cm (5 meter)",
        "pembahasan": "Skala 1 : 100 berarti 1 cm di denah = 100 cm sebenarnya. Jarak sebenarnya = 5 x 100 = 500 cm = 5 meter."
      },
      {
        "soal": "Jarak sebenarnya dua kota adalah 12 km. Kota-kota itu digambar pada peta dengan skala 1 : 400.000. Berapa jarak kedua kota pada peta?",
        "jawaban": "3 cm",
        "pembahasan": "Ubah 12 km ke cm: 12 km = 1.200.000 cm. Jarak pada peta = jarak sebenarnya : penyebut skala = 1.200.000 : 400.000 = 3 cm."
      },
      {
        "soal": "Perbandingan uang Sinta dan Rani adalah 4 : 7. Jika selisih uang mereka Rp15.000, berapa jumlah uang mereka berdua?",
        "jawaban": "Rp55.000",
        "pembahasan": "Selisih bagian = 7 - 4 = 3 bagian, senilai Rp15.000. Jadi 1 bagian = 15.000 : 3 = Rp5.000. Jumlah bagian = 4 + 7 = 11 bagian = 11 x 5.000 = Rp55.000."
      }
    ]
  },
  {
    "id": "sd-c-bangun-ruang",
    "jenjang": "SD",
    "fase": "Fase C",
    "bidang": "Geometri",
    "topik": "Sifat bangun ruang (kubus, balok, prisma, limas, tabung, kerucut, bola)",
    "judul": "Mengenal Sifat Bangun Ruang",
    "blurb": "Yuk kenali sisi, rusuk, dan titik sudut bangun ruang di sekitarmu supaya makin jago geometri!",
    "xp": 30,
    "soal": [
      {
        "soal": "Sebuah kubus mempunyai berapa banyak sisi (bidang)?",
        "jawaban": "6 sisi",
        "pembahasan": "Kubus dibatasi oleh 6 sisi yang semuanya berbentuk persegi dan sama besar (atas, bawah, dan 4 sisi tegak)."
      },
      {
        "soal": "Bangun ruang apa yang seluruh permukaannya lengkung serta tidak punya rusuk dan titik sudut? Contohnya seperti bola sepak.",
        "jawaban": "Bola",
        "pembahasan": "Bola hanya memiliki 1 sisi lengkung, tidak memiliki rusuk, dan tidak memiliki titik sudut sama sekali."
      },
      {
        "soal": "Sebuah balok mempunyai berapa banyak rusuk?",
        "jawaban": "12 rusuk",
        "pembahasan": "Sama seperti kubus, balok memiliki 12 rusuk. Rusuk itu terdiri dari 4 rusuk panjang, 4 rusuk lebar, dan 4 rusuk tinggi."
      },
      {
        "soal": "Sebuah bangun ruang memiliki 2 sisi datar berbentuk lingkaran, 1 sisi lengkung (selimut), dan 2 rusuk lengkung. Bangun ruang apakah itu?",
        "jawaban": "Tabung",
        "pembahasan": "Tabung punya 3 sisi: 2 lingkaran di atas dan bawah serta 1 selimut lengkung. Kedua lingkaran itu membentuk 2 rusuk lengkung, dan tabung tidak punya titik sudut. Ciri-ciri ini cocok dengan tabung."
      },
      {
        "soal": "Sebuah limas mempunyai alas berbentuk persegi (limas segi empat). Berapa banyak titik sudut dan rusuk limas tersebut?",
        "jawaban": "5 titik sudut dan 8 rusuk",
        "pembahasan": "Titik sudut = 4 titik di alas persegi + 1 titik puncak = 5 titik sudut. Rusuk = 4 rusuk di alas + 4 rusuk tegak menuju puncak = 8 rusuk."
      }
    ]
  },
  {
    "id": "sd-c-jaring",
    "jenjang": "SD",
    "fase": "Fase C",
    "bidang": "Geometri",
    "topik": "Jaring-jaring bangun ruang sederhana",
    "judul": "Jaring-jaring Bangun Ruang",
    "blurb": "Yuk, buka bangun ruang jadi lembaran datar dan cari tahu bentuk-bentuk penyusunnya!",
    "xp": 30,
    "soal": [
      {
        "soal": "Jaring-jaring kubus tersusun dari beberapa bangun datar yang sama besar. Bangun datar apa itu dan berapa banyaknya?",
        "jawaban": "Persegi, sebanyak 6 buah.",
        "pembahasan": "Kubus punya 6 sisi yang semuanya berbentuk persegi sama besar. Jadi jaring-jaringnya terdiri dari 6 persegi."
      },
      {
        "soal": "Sebuah jaring-jaring tersusun dari 6 persegi panjang. Jika dilipat, bangun ruang apa yang terbentuk?",
        "jawaban": "Balok.",
        "pembahasan": "Balok memiliki 6 sisi yang berbentuk persegi panjang. Karena jaring-jaringnya terdiri dari 6 persegi panjang, saat dilipat akan membentuk balok."
      },
      {
        "soal": "Jaring-jaring tabung terdiri dari bangun datar apa saja dan berapa banyak masing-masing?",
        "jawaban": "2 lingkaran dan 1 persegi panjang.",
        "pembahasan": "Tabung punya 2 sisi lingkaran (alas dan tutup) serta 1 selimut yang jika dibuka mendatar berbentuk persegi panjang. Jadi jaring-jaringnya adalah 2 lingkaran dan 1 persegi panjang."
      },
      {
        "soal": "Jaring-jaring prisma segitiga terdiri dari bangun datar apa saja dan berapa banyak masing-masing?",
        "jawaban": "2 segitiga dan 3 persegi panjang.",
        "pembahasan": "Prisma segitiga punya 2 sisi berbentuk segitiga (alas dan atas) dan 3 sisi tegak berbentuk persegi panjang. Jadi jaring-jaringnya adalah 2 segitiga dan 3 persegi panjang."
      },
      {
        "soal": "Jaring-jaring kubus tersusun dari 6 persegi. Saat dilipat menjadi kubus, satu persegi menjadi alas dan satu persegi menjadi tutup yang saling berhadapan. Berapa banyak persegi yang menjadi sisi tegak (dinding samping) kubus?",
        "jawaban": "4 persegi.",
        "pembahasan": "Kubus punya 6 sisi. Sisi alas dan tutup berjumlah 2 sisi. Sisanya 6 - 2 = 4 sisi, dan keempatnya menjadi sisi tegak atau dinding samping kubus."
      }
    ]
  },
  {
    "id": "sd-c-koordinat",
    "jenjang": "SD",
    "fase": "Fase C",
    "bidang": "Geometri",
    "topik": "Sistem berpetak: letak, jalur & jarak pada denah",
    "judul": "Denah & Sistem Berpetak",
    "blurb": "Yuk belajar membaca letak, menyusuri jalur, dan menghitung jarak di sistem berpetak, seru seperti mencari harta karun di peta!",
    "xp": 32,
    "soal": [
      {
        "soal": "Sebuah tanda bintang berada tepat di perpotongan garis tegak C dengan garis mendatar 3. Tuliskan letak tanda bintang itu dalam bentuk pasangan huruf dan bilangan.",
        "jawaban": "(C, 3)",
        "pembahasan": "Garis tegak (vertikal) dinamai dengan huruf, yaitu C. Garis mendatar (horizontal) dinamai dengan bilangan, yaitu 3. Tulis huruf dulu baru bilangan, sehingga letaknya (C, 3)."
      },
      {
        "soal": "Titik R terletak di (D, 2). Garis tegak dan garis mendatar yang mana yang berpotongan tepat di titik R?",
        "jawaban": "Garis D dan garis 2",
        "pembahasan": "Pada pasangan (D, 2), huruf D adalah nama garis tegak dan bilangan 2 adalah nama garis mendatar. Jadi titik R berada di perpotongan garis D dengan garis 2."
      },
      {
        "soal": "Titik M berada di (B, 1) dan titik N berada di (B, 5). Karena hurufnya sama-sama B, berapa langkah jarak dari M ke N?",
        "jawaban": "4 langkah",
        "pembahasan": "Huruf sama (B) berarti kedua titik segaris tegak, jadi tidak ada langkah mendatar. Jaraknya hanya dari selisih bilangan: dari 1 ke 5 = 5 - 1 = 4 langkah ke atas."
      },
      {
        "soal": "Tigor berjalan dari titik K(A, 1) ke titik L(D, 3) pada sistem berpetak. Berapa langkah paling sedikit yang ia tempuh?",
        "jawaban": "5 langkah",
        "pembahasan": "Jarak mendatar = selisih huruf A ke D = A-B-C-D = 3 langkah ke kanan. Jarak menaik = selisih bilangan 1 ke 3 = 2 langkah ke atas. Jumlahkan: 3 + 2 = 5 langkah."
      },
      {
        "soal": "Dari titik (A, 3) ke titik (E, 5), Sari memilih jalur ke kanan dulu baru naik, sedangkan Doni memilih naik dulu baru ke kanan. Apakah jumlah langkah kedua jalur itu sama? Berapa langkah?",
        "jawaban": "Sama, 6 langkah",
        "pembahasan": "Keduanya sama-sama menempuh 4 langkah ke kanan (A-B-C-D-E) dan 2 langkah ke atas (3-4-5), yaitu 4 + 2 = 6 langkah. Urutan beloknya boleh berbeda, tetapi antara dua titik ada banyak jalur terpendek yang panjangnya sama."
      }
    ]
  },
  {
    "id": "sd-c-mmm",
    "jenjang": "SD",
    "fase": "Fase C",
    "bidang": "Data & Peluang",
    "topik": "Turus & tabel frekuensi, piktogram, diagram batang (vertikal/horizontal/ganda) & skala peluang (percobaan acak, permainan adil)",
    "judul": "Menyajikan Data & Peluang",
    "blurb": "Yuk belajar menyajikan data lewat turus, piktogram, dan diagram batang, lalu menaksir peluang kejadian dari \"tidak mungkin\" sampai \"pasti\"!",
    "xp": 30,
    "soal": [
      {
        "soal": "Nisa mencatat data memakai turus. Ingat, satu kelompok turus berisi 5 (empat garis tegak dan satu garis miring). Jika warna biru mendapat 1 kelompok turus penuh ditambah 3 garis lagi, berapa frekuensi (banyaknya) siswa yang menyukai warna biru?",
        "jawaban": "8 siswa",
        "pembahasan": "Satu kelompok turus penuh = 5. Ditambah 3 garis lagi menjadi 5 + 3 = 8. Jadi frekuensinya 8 siswa. Yang ditulis di tabel frekuensi adalah angkanya, yaitu 8."
      },
      {
        "soal": "Pada sebuah piktogram, 1 gambar apel mewakili 10 apel. Keranjang B digambar dengan 2 gambar penuh dan 1 setengah gambar. Berapa banyak apel di keranjang B?",
        "jawaban": "25 apel",
        "pembahasan": "Nilai = banyak gambar x kunci. 2 gambar penuh = 2 x 10 = 20 apel. Setengah gambar = setengah x 10 = 5 apel. Jumlahnya 20 + 5 = 25 apel."
      },
      {
        "soal": "Sebuah diagram batang ganda menunjukkan banyak buku terjual di Toko A dan Toko B. Hari Senin: Toko A = 20 buku, Toko B = 15 buku. Hari Selasa: Toko A = 10 buku, Toko B = 25 buku. Pada hari apa Toko B menjual buku lebih banyak daripada Toko A?",
        "jawaban": "Hari Selasa",
        "pembahasan": "Bandingkan tinggi batang tiap hari. Senin: batang A (20) lebih tinggi daripada B (15). Selasa: batang B (25) lebih tinggi daripada A (10). Jadi Toko B menjual lebih banyak pada hari Selasa."
      },
      {
        "soal": "Di dalam kantong ada 6 kelereng merah dan 1 kelereng kuning. Kamu mengambil 1 kelereng tanpa melihat. Isilah dengan kata yang tepat (pasti / sangat mungkin / tidak mungkin): terambilnya kelereng merah adalah ....",
        "jawaban": "sangat mungkin",
        "pembahasan": "Kelereng merah (6) jauh lebih banyak daripada kuning (1), jadi terambil merah sangat mungkin, tetapi belum pasti karena masih ada 1 kelereng kuning. Terambilnya kelereng hijau tidak mungkin karena tidak ada kelereng hijau di kantong."
      },
      {
        "soal": "Dinda dan Riko bermain. Dinda menang jika lemparan koin muncul sisi gambar. Riko menang jika lemparan dadu (bermata 1 sampai 6) muncul angka 6. Siapa yang peluang menangnya lebih besar, dan apakah permainan ini adil?",
        "jawaban": "Dinda; permainan tidak adil",
        "pembahasan": "Peluang Dinda menang 1 dari 2 kemungkinan (koin), sedangkan Riko 1 dari 6 kemungkinan (dadu). Kesempatan Dinda lebih besar. Karena kesempatan menang keduanya tidak sama, permainan ini kurang adil (tidak adil)."
      }
    ]
  },
  {
    "id": "smp-d-bilangan",
    "jenjang": "SMP",
    "fase": "Fase D",
    "bidang": "Bilangan",
    "topik": "Bilangan bulat, rasional, berpangkat, bentuk akar & aritmatika sosial (bunga, diskon, pajak)",
    "judul": "Bilangan & Aritmatika Sosial",
    "blurb": "Yuk kuasai bilangan bulat, pecahan, pangkat, akar, sampai hitung diskon dan pajak di kehidupan sehari-hari!",
    "xp": 60,
    "soal": [
      {
        "soal": "Hitung hasil dari (-8) + 15 - (-3).",
        "jawaban": "10",
        "pembahasan": "(-8) + 15 = 7. Lalu 7 - (-3) = 7 + 3 = 10."
      },
      {
        "soal": "Hitung 1/2 + 2/3 dan tulis sebagai pecahan.",
        "jawaban": "7/6 (atau 1 1/6)",
        "pembahasan": "Samakan penyebut jadi 6: 1/2 = 3/6 dan 2/3 = 4/6. Jumlahkan: 3/6 + 4/6 = 7/6 = 1 1/6."
      },
      {
        "soal": "Hitung 2^3 x 2^2.",
        "jawaban": "32",
        "pembahasan": "Basis sama, pangkat dijumlahkan: 2^(3+2) = 2^5. Nilainya 2x2x2x2x2 = 32."
      },
      {
        "soal": "Sederhanakan akar(50) + akar(2).",
        "jawaban": "6 akar(2)",
        "pembahasan": "akar(50) = akar(25 x 2) = 5 akar(2). Suku sejenis dijumlah: 5 akar(2) + 1 akar(2) = 6 akar(2)."
      },
      {
        "soal": "Sebuah baju berharga Rp200.000 mendapat diskon 25%. Setelah diskon, harga masih dikenakan pajak 10%. Berapa harga yang harus dibayar?",
        "jawaban": "Rp165.000",
        "pembahasan": "Diskon = 25% x 200.000 = 50.000, jadi harga setelah diskon = 200.000 - 50.000 = 150.000. Pajak = 10% x 150.000 = 15.000. Dibayar = 150.000 + 15.000 = 165.000."
      }
    ]
  },
  {
    "id": "smp-d-aljabar",
    "jenjang": "SMP",
    "fase": "Fase D",
    "bidang": "Aljabar",
    "topik": "Bentuk aljabar, PLSV & PtLSV, SPLDV, relasi & fungsi linear",
    "judul": "Jago Aljabar: Bentuk, Persamaan & Fungsi",
    "blurb": "Yuk kuasai aljabar langkah demi langkah, dari menyederhanakan bentuk sampai menemukan rumus fungsi linear!",
    "xp": 60,
    "soal": [
      {
        "soal": "Sederhanakan bentuk aljabar berikut: 7x + 4x - 3x.",
        "jawaban": "8x",
        "pembahasan": "Semua suku sejenis (mengandung x), jadi tinggal jumlahkan koefisiennya: (7 + 4 - 3)x = 8x."
      },
      {
        "soal": "Tentukan nilai x dari persamaan linear satu variabel 2x + 5 = 17.",
        "jawaban": "x = 6",
        "pembahasan": "Pindahkan 5 ke ruas kanan: 2x = 17 - 5 = 12. Lalu bagi kedua ruas dengan 2: x = 12/2 = 6. Cek: 2(6) + 5 = 17 (benar)."
      },
      {
        "soal": "Tentukan himpunan penyelesaian dari pertidaksamaan 3x - 4 < 11, dengan x bilangan real.",
        "jawaban": "x < 5",
        "pembahasan": "Tambahkan 4 ke kedua ruas: 3x < 15. Bagi kedua ruas dengan 3 (positif, sehingga tanda pertidaksamaan tetap): x < 5. Jadi HP = {x | x < 5, x bilangan real}."
      },
      {
        "soal": "Diketahui sistem persamaan linear dua variabel: x + y = 8 dan x - y = 2. Tentukan nilai x dan y.",
        "jawaban": "x = 5, y = 3",
        "pembahasan": "Jumlahkan kedua persamaan (metode eliminasi): (x + y) + (x - y) = 8 + 2, sehingga 2x = 10 dan x = 5. Substitusi ke x + y = 8: 5 + y = 8, maka y = 3."
      },
      {
        "soal": "Sebuah fungsi linear dirumuskan f(x) = ax + b. Jika f(1) = 5 dan f(3) = 11, tentukan rumus fungsi f(x).",
        "jawaban": "f(x) = 3x + 2",
        "pembahasan": "Dari f(1) = 5 diperoleh a + b = 5, dan dari f(3) = 11 diperoleh 3a + b = 11. Kurangkan persamaan pertama dari kedua untuk mengeliminasi b: (3a + b) - (a + b) = 11 - 5, sehingga 2a = 6 dan a = 3. Substitusi a = 3 ke a + b = 5: 3 + b = 5, maka b = 2. Jadi f(x) = 3x + 2."
      }
    ]
  },
  {
    "id": "smp-d-geometri",
    "jenjang": "SMP",
    "fase": "Fase D",
    "bidang": "Geometri",
    "topik": "Sudut, garis sejajar, Pythagoras, transformasi geometri, kesebangunan & kekongruenan",
    "judul": "Jelajah Geometri SMP",
    "blurb": "Yuk taklukkan sudut, garis sejajar, Pythagoras, transformasi, dan kesebangunan lewat 5 soal seru!",
    "xp": 60,
    "soal": [
      {
        "soal": "Dua sudut saling berpelurus. Jika besar salah satu sudut 65 derajat, berapa besar sudut yang lain?",
        "jawaban": "115 derajat",
        "pembahasan": "Sudut berpelurus (berpelurus/lurus) berjumlah 180 derajat. Jadi 180 - 65 = 115 derajat."
      },
      {
        "soal": "Dua garis sejajar dipotong oleh sebuah garis transversal. Sepasang sudut dalam sepihak diketahui salah satunya 115 derajat. Tentukan besar sudut dalam sepihak yang lain.",
        "jawaban": "65 derajat",
        "pembahasan": "Pada garis sejajar, sudut dalam sepihak berjumlah 180 derajat. Jadi 180 - 115 = 65 derajat."
      },
      {
        "soal": "Sebuah segitiga siku-siku memiliki dua sisi tegak lurus 6 cm dan 8 cm. Tentukan panjang sisi miring (hipotenusa).",
        "jawaban": "10 cm",
        "pembahasan": "Dengan teorema Pythagoras: c = akar(6^2 + 8^2) = akar(36 + 64) = akar(100) = 10 cm."
      },
      {
        "soal": "Titik A(4, -2) ditranslasi oleh T(-3, 5). Tentukan koordinat bayangannya, A'.",
        "jawaban": "A'(1, 3)",
        "pembahasan": "Translasi menambahkan komponen vektor ke koordinat: A' = (4 + (-3), -2 + 5) = (1, 3)."
      },
      {
        "soal": "Segitiga ABC siku-siku di C dengan AC = 12 cm dan BC = 16 cm. Dari titik C ditarik garis tinggi CD yang tegak lurus sisi miring AB. Tentukan panjang CD.",
        "jawaban": "9,6 cm",
        "pembahasan": "Cari AB dengan Pythagoras: AB = akar(12^2 + 16^2) = akar(144 + 256) = akar(400) = 20 cm. Gunakan kesamaan luas segitiga: 1/2 x AC x BC = 1/2 x AB x CD, sehingga CD = (12 x 16) / 20 = 192 / 20 = 9,6 cm."
      }
    ]
  },
  {
    "id": "smp-d-pengukuran",
    "jenjang": "SMP",
    "fase": "Fase D",
    "bidang": "Pengukuran",
    "topik": "Luas permukaan & volume bangun ruang (prisma, limas, tabung, kerucut, bola)",
    "judul": "Luas Permukaan & Volume Bangun Ruang",
    "blurb": "Yuk hitung \"kulit\" dan \"isi\" prisma, limas, tabung, kerucut, sampai bola dengan rumus yang gampang diingat!",
    "xp": 60,
    "soal": [
      {
        "soal": "Sebuah tabung memiliki jari-jari alas 7 cm dan tinggi 10 cm. Tentukan volume tabung tersebut (gunakan pi = 22/7).",
        "jawaban": "1540 cm^3",
        "pembahasan": "Volume tabung = pi x r^2 x t = 22/7 x 7^2 x 10 = 22/7 x 49 x 10 = 22 x 7 x 10 = 1540 cm^3."
      },
      {
        "soal": "Sebuah bola mempunyai jari-jari 10 cm. Hitunglah luas permukaan bola tersebut (gunakan pi = 3,14).",
        "jawaban": "1256 cm^2",
        "pembahasan": "Luas permukaan bola = 4 x pi x r^2 = 4 x 3,14 x 10^2 = 4 x 3,14 x 100 = 1256 cm^2."
      },
      {
        "soal": "Sebuah prisma memiliki alas berbentuk segitiga siku-siku dengan panjang alas 6 cm dan tinggi 8 cm. Jika tinggi prisma 15 cm, tentukan volume prisma.",
        "jawaban": "360 cm^3",
        "pembahasan": "Cari luas alas dulu: 1/2 x 6 x 8 = 24 cm^2. Lalu volume prisma = luas alas x tinggi prisma = 24 x 15 = 360 cm^3."
      },
      {
        "soal": "Sebuah kerucut memiliki jari-jari alas 6 cm dan tinggi 8 cm. Tentukan luas permukaan kerucut tersebut (gunakan pi = 3,14).",
        "jawaban": "301,44 cm^2",
        "pembahasan": "Cari garis pelukis s dengan Pythagoras: s = akar(r^2 + t^2) = akar(6^2 + 8^2) = akar(36 + 64) = akar(100) = 10 cm. Luas permukaan = pi x r x (r + s) = 3,14 x 6 x (6 + 10) = 3,14 x 6 x 16 = 3,14 x 96 = 301,44 cm^2."
      },
      {
        "soal": "Sebuah limas memiliki alas berbentuk persegi dengan panjang sisi 12 cm dan tinggi limas 8 cm. Hitunglah luas permukaan limas tersebut.",
        "jawaban": "384 cm^2",
        "pembahasan": "Cari tinggi segitiga tegak (apotema) dengan Pythagoras: t segitiga = akar((sisi/2)^2 + tinggi limas^2) = akar(6^2 + 8^2) = akar(36 + 64) = akar(100) = 10 cm. Luas alas = 12 x 12 = 144 cm^2. Luas 4 segitiga tegak = 4 x (1/2 x 12 x 10) = 4 x 60 = 240 cm^2. Luas permukaan = 144 + 240 = 384 cm^2."
      }
    ]
  },
  {
    "id": "smp-d-data-peluang",
    "jenjang": "SMP",
    "fase": "Fase D",
    "bidang": "Data & Peluang",
    "topik": "Pemusatan & jangkauan data, penyajian data, peluang kejadian tunggal",
    "judul": "Jago Data & Peluang",
    "blurb": "Yuk pahami rata-rata, median, modus, jangkauan, sampai peluang lewat contoh sehari-hari yang seru!",
    "xp": 58,
    "soal": [
      {
        "soal": "Nilai ulangan Matematika 5 siswa adalah 7, 8, 6, 9, dan 10. Tentukan rata-rata (mean) nilai kelima siswa tersebut.",
        "jawaban": "8",
        "pembahasan": "Jumlahkan semua nilai: 7+8+6+9+10 = 40. Bagi dengan banyak data (5): 40 : 5 = 8. Jadi rata-ratanya 8."
      },
      {
        "soal": "Data banyak buku yang dibaca 5 anak dalam sebulan: 4, 7, 9, 3, dan 6. Tentukan jangkauan (range) data tersebut.",
        "jawaban": "6",
        "pembahasan": "Jangkauan = data terbesar - data terkecil. Data terbesar = 9, data terkecil = 3. Maka jangkauan = 9 - 3 = 6."
      },
      {
        "soal": "Diberikan data nilai: 6, 8, 5, 8, 7, dan 9. Tentukan modus dan median dari data tersebut.",
        "jawaban": "Modus = 8; Median = 7,5",
        "pembahasan": "Modus adalah data yang paling sering muncul, yaitu 8 (muncul 2 kali). Untuk median, urutkan dulu: 5, 6, 7, 8, 8, 9. Datanya genap (6 data), jadi median = rata-rata dua data tengah (data ke-3 dan ke-4) = (7+8) : 2 = 7,5."
      },
      {
        "soal": "Sebuah dadu berisi enam sisi dilempar satu kali. Tentukan peluang muncul mata dadu berupa bilangan prima.",
        "jawaban": "1/2",
        "pembahasan": "Seluruh kemungkinan = {1,2,3,4,5,6}, jadi n(S) = 6. Bilangan prima pada dadu = {2, 3, 5}, jadi n(A) = 3. Peluang = n(A)/n(S) = 3/6 = 1/2."
      },
      {
        "soal": "Nilai ulangan 10 siswa disajikan dalam tabel frekuensi berikut: nilai 6 sebanyak 2 siswa, nilai 7 sebanyak 3 siswa, nilai 8 sebanyak 4 siswa, dan nilai 9 sebanyak 1 siswa. Tentukan rata-rata nilai kelas tersebut, lalu tentukan peluang seorang siswa yang dipilih acak mendapat nilai minimal 8.",
        "jawaban": "Rata-rata = 7,4; Peluang = 1/2",
        "pembahasan": "Jumlah nilai = (6x2)+(7x3)+(8x4)+(9x1) = 12+21+32+9 = 74. Banyak siswa = 2+3+4+1 = 10. Rata-rata = 74 : 10 = 7,4. Siswa dengan nilai minimal 8 (yaitu nilai 8 atau 9) = 4+1 = 5 siswa. Peluang = 5/10 = 1/2."
      }
    ]
  },
  {
    "id": "sma-f-lingkaran",
    "jenjang": "SMA",
    "fase": "Fase F",
    "bidang": "Geometri",
    "topik": "Lingkaran: persamaan lingkaran & garis singgung",
    "judul": "Lingkaran: Persamaan & Garis Singgung",
    "blurb": "Yuk kuasai persamaan lingkaran dan cara menemukan garis singgungnya lewat 5 soal seru!",
    "xp": 90,
    "soal": [
      {
        "soal": "Tentukan koordinat pusat dan panjang jari-jari lingkaran x^2 + y^2 = 49.",
        "jawaban": "Pusat (0, 0), jari-jari 7.",
        "pembahasan": "Bentuk x^2 + y^2 = r^2 berpusat di O(0,0). Dari r^2 = 49 diperoleh r = akar(49) = 7. Jadi pusat (0,0) dan jari-jari 7."
      },
      {
        "soal": "Tentukan persamaan lingkaran yang berpusat di titik (3, -2) dengan jari-jari 4.",
        "jawaban": "(x - 3)^2 + (y + 2)^2 = 16.",
        "pembahasan": "Gunakan bentuk (x - a)^2 + (y - b)^2 = r^2 dengan pusat (a, b) = (3, -2) dan r = 4. Substitusi: (x - 3)^2 + (y - (-2))^2 = 4^2, sehingga (x - 3)^2 + (y + 2)^2 = 16."
      },
      {
        "soal": "Tentukan pusat dan jari-jari lingkaran x^2 + y^2 - 6x + 8y - 11 = 0.",
        "jawaban": "Pusat (3, -4), jari-jari 6.",
        "pembahasan": "Kelompokkan lalu lengkapi kuadrat: (x^2 - 6x) + (y^2 + 8y) = 11. Menjadi (x - 3)^2 - 9 + (y + 4)^2 - 16 = 11, sehingga (x - 3)^2 + (y + 4)^2 = 36. Pusat (3, -4) dan r = akar(36) = 6."
      },
      {
        "soal": "Tentukan persamaan garis singgung lingkaran x^2 + y^2 = 25 di titik (3, 4).",
        "jawaban": "3x + 4y = 25.",
        "pembahasan": "Cek titik pada lingkaran: 3^2 + 4^2 = 9 + 16 = 25 (benar). Gunakan rumus garis singgung di titik (x1, y1): x1*x + y1*y = r^2. Substitusi (x1, y1) = (3, 4) dan r^2 = 25 diperoleh 3x + 4y = 25."
      },
      {
        "soal": "Tentukan persamaan garis singgung lingkaran x^2 + y^2 = 20 yang bergradien 2.",
        "jawaban": "y = 2x + 10 dan y = 2x - 10.",
        "pembahasan": "Untuk lingkaran x^2 + y^2 = r^2, garis singgung bergradien m adalah y = mx +- r*akar(1 + m^2). Di sini r^2 = 20 dan m = 2, sehingga r*akar(1 + m^2) = akar(20) * akar(1 + 4) = akar(20 * 5) = akar(100) = 10. Jadi garis singgungnya y = 2x + 10 dan y = 2x - 10."
      }
    ]
  },
  {
    "id": "sma-f-komposisi-invers",
    "jenjang": "SMA",
    "fase": "Fase F",
    "bidang": "Aljabar",
    "topik": "Komposisi fungsi & fungsi invers",
    "judul": "Komposisi Fungsi & Fungsi Invers",
    "blurb": "Yuk belajar cara menggabungkan dua fungsi dan mencari \"kebalikannya\" dengan langkah yang gampang diikuti!",
    "xp": 90,
    "soal": [
      {
        "soal": "Diketahui f(x) = 3x + 1 dan g(x) = x - 2. Tentukan nilai (f o g)(5).",
        "jawaban": "10",
        "pembahasan": "Kerjakan dari dalam: g(5) = 5 - 2 = 3. Lalu f(3) = 3(3) + 1 = 10."
      },
      {
        "soal": "Diketahui f(x) = x + 3 dan g(x) = 2x. Tentukan rumus (f o g)(x).",
        "jawaban": "2x + 3",
        "pembahasan": "(f o g)(x) = f(g(x)) = f(2x). Substitusi 2x ke f: f(2x) = 2x + 3."
      },
      {
        "soal": "Tentukan rumus fungsi invers dari f(x) = 3x - 9.",
        "jawaban": "f^-1(x) = (x + 9)/3",
        "pembahasan": "Misalkan y = 3x - 9. Selesaikan x: 3x = y + 9, jadi x = (y + 9)/3. Ganti y dengan x: f^-1(x) = (x + 9)/3."
      },
      {
        "soal": "Diketahui f(x) = 2x + 3 dan (f o g)(x) = 4x - 1. Tentukan rumus g(x).",
        "jawaban": "g(x) = 2x - 2",
        "pembahasan": "(f o g)(x) = f(g(x)) = 2 g(x) + 3. Samakan dengan 4x - 1: 2 g(x) + 3 = 4x - 1, jadi 2 g(x) = 4x - 4 dan g(x) = 2x - 2."
      },
      {
        "soal": "Tentukan rumus fungsi invers dari f(x) = (2x + 1)/(x - 3), dengan x tidak sama dengan 3.",
        "jawaban": "f^-1(x) = (3x + 1)/(x - 2), x tidak sama dengan 2",
        "pembahasan": "Misalkan y = (2x + 1)/(x - 3). Kalikan silang: y(x - 3) = 2x + 1, jadi yx - 3y = 2x + 1. Kumpulkan suku x: yx - 2x = 3y + 1, sehingga x(y - 2) = 3y + 1 dan x = (3y + 1)/(y - 2). Ganti y dengan x: f^-1(x) = (3x + 1)/(x - 2), x tidak sama dengan 2."
      }
    ]
  },
  {
    "id": "sma-f-transformasi-matriks",
    "jenjang": "SMA",
    "fase": "Fase F",
    "bidang": "Geometri",
    "topik": "Transformasi geometri menggunakan matriks",
    "judul": "Transformasi Geometri dengan Matriks",
    "blurb": "Yuk pakai matriks untuk mencerminkan, memutar, dan memperbesar titik-titik di bidang koordinat dengan rapi!",
    "xp": 90,
    "soal": [
      {
        "soal": "Titik P(4, -3) direfleksikan terhadap sumbu X menggunakan matriks [[1, 0], [0, -1]]. Tentukan koordinat bayangan P'.",
        "jawaban": "P'(4, 3)",
        "pembahasan": "Kalikan matriks dengan vektor titik: [[1,0],[0,-1]] . [4, -3]. Baris 1: 1*4 + 0*(-3) = 4. Baris 2: 0*4 + (-1)*(-3) = 3. Jadi P'(4, 3)."
      },
      {
        "soal": "Titik R(3, -2) didilatasi dengan pusat O(0, 0) dan faktor skala 3, menggunakan matriks [[3, 0], [0, 3]]. Tentukan bayangan R'.",
        "jawaban": "R'(9, -6)",
        "pembahasan": "Kalikan matriks dilatasi dengan titik: [[3,0],[0,3]] . [3, -2]. Baris 1: 3*3 + 0*(-2) = 9. Baris 2: 0*3 + 3*(-2) = -6. Jadi R'(9, -6). Semua koordinat dikali 3."
      },
      {
        "soal": "Titik Q(2, 5) dirotasi 90 derajat berlawanan arah jarum jam terhadap titik asal O. Matriks rotasinya [[0, -1], [1, 0]]. Tentukan bayangan Q'.",
        "jawaban": "Q'(-5, 2)",
        "pembahasan": "Kalikan matriks rotasi dengan titik: [[0,-1],[1,0]] . [2, 5]. Baris 1: 0*2 + (-1)*5 = -5. Baris 2: 1*2 + 0*5 = 2. Jadi Q'(-5, 2)."
      },
      {
        "soal": "Titik A(1, 2) pertama dirotasi 90 derajat berlawanan arah jarum jam terhadap O, lalu hasilnya direfleksikan terhadap sumbu Y. Tentukan koordinat bayangan akhirnya.",
        "jawaban": "A''(2, 1)",
        "pembahasan": "Langkah 1 rotasi 90 derajat, matriks [[0,-1],[1,0]] . [1, 2] = [(0*1 - 1*2), (1*1 + 0*2)] = (-2, 1). Langkah 2 refleksi sumbu Y berarti (x, y) menjadi (-x, y): (-2, 1) menjadi (2, 1). Jadi A''(2, 1)."
      },
      {
        "soal": "Tentukan matriks tunggal yang mewakili rotasi 90 derajat berlawanan arah jarum jam terhadap O yang dilanjutkan refleksi terhadap garis y = x. Kemudian gunakan matriks itu untuk menentukan bayangan titik B(3, -1).",
        "jawaban": "Matriks tunggal [[1, 0], [0, -1]] dan B'(3, 1)",
        "pembahasan": "Matriks rotasi R = [[0,-1],[1,0]] dan matriks refleksi garis y=x M = [[0,1],[1,0]]. Transformasi berurutan = M . R (yang belakangan di kiri). M.R = [[0,1],[1,0]] . [[0,-1],[1,0]] = [[1,0],[0,-1]], yaitu matriks refleksi terhadap sumbu X. Terapkan ke B: [[1,0],[0,-1]] . [3, -1] = [3, 1]. Jadi B'(3, 1)."
      }
    ]
  },
  {
    "id": "sma-f-statistika-lanjut",
    "jenjang": "SMA",
    "fase": "Fase F",
    "bidang": "Data & Peluang",
    "topik": "Statistika lanjut: regresi linear & data bivariat",
    "judul": "Regresi Linear & Data Bivariat",
    "blurb": "Yuk belajar menemukan garis paling pas untuk dua data yang berpasangan, dari membaca arah korelasi sampai membuat prediksi!",
    "xp": 90,
    "soal": [
      {
        "soal": "Data lama belajar (jam) dan nilai ulangan lima siswa: (1, 60), (2, 65), (3, 72), (4, 78), (5, 85). Tentukan jenis korelasi antara lama belajar (x) dan nilai (y), lalu jelaskan singkat.",
        "jawaban": "Korelasi positif.",
        "pembahasan": "Amati polanya: setiap kali x (lama belajar) bertambah, y (nilai) ikut naik. Hubungan searah seperti ini disebut korelasi positif."
      },
      {
        "soal": "Persamaan regresi y = 55 + 6x menyatakan hubungan lama belajar x (jam) dengan nilai ulangan y. Prediksi nilai seorang siswa yang belajar 5 jam.",
        "jawaban": "85",
        "pembahasan": "Substitusikan x = 5 ke persamaan: y = 55 + 6(5) = 55 + 30 = 85."
      },
      {
        "soal": "Garis regresi selalu melalui titik (rata-rata x, rata-rata y). Diketahui rata-rata lama belajar = 5 jam dan rata-rata nilai = 80, serta koefisien regresi (gradien) b = 4. Tentukan persamaan garis regresi y = a + bx.",
        "jawaban": "y = 60 + 4x",
        "pembahasan": "Gunakan a = (rata-rata y) - b*(rata-rata x) = 80 - 4(5) = 80 - 20 = 60. Jadi persamaan regresinya y = 60 + 4x."
      },
      {
        "soal": "Diketahui data pasangan (x, y): (1, 3), (2, 4), (3, 6), (4, 7), (5, 10). Hitung koefisien regresi (gradien) b dengan rumus b = (n*Sxy - Sx*Sy) / (n*Sxx - (Sx)^2), dengan S menyatakan jumlah.",
        "jawaban": "b = 1,7",
        "pembahasan": "n = 5. Jumlah x = 15; jumlah y = 30; jumlah xy = 3+8+18+28+50 = 107; jumlah x^2 = 1+4+9+16+25 = 55. Maka b = (5*107 - 15*30) / (5*55 - 15^2) = (535 - 450) / (275 - 225) = 85/50 = 1,7."
      },
      {
        "soal": "Data waktu tayang iklan x (menit) dan penjualan y (juta rupiah): (1, 4), (2, 6), (3, 7), (4, 9), (5, 10). Tentukan persamaan regresi linear y = a + bx, lalu prediksi penjualan saat iklan tayang 6 menit.",
        "jawaban": "y = 2,7 + 1,5x; prediksi sekitar 11,7 juta rupiah.",
        "pembahasan": "n = 5. Jumlah x = 15; jumlah y = 36; jumlah xy = 4+12+21+36+50 = 123; jumlah x^2 = 55. Hitung b = (5*123 - 15*36) / (5*55 - 15^2) = (615 - 540)/50 = 75/50 = 1,5. Rata-rata x = 3 dan rata-rata y = 7,2, sehingga a = 7,2 - 1,5(3) = 7,2 - 4,5 = 2,7. Persamaan: y = 2,7 + 1,5x. Untuk x = 6: y = 2,7 + 1,5(6) = 2,7 + 9 = 11,7."
      }
    ]
  },
  {
    "id": "sma-f-peluang-bersyarat",
    "jenjang": "SMA",
    "fase": "Fase F",
    "bidang": "Data & Peluang",
    "topik": "Peluang bersyarat",
    "judul": "Peluang Bersyarat",
    "blurb": "Belajar menghitung peluang suatu kejadian ketika kita sudah tahu kejadian lain terjadi, biar tebakanmu makin akurat!",
    "xp": 90,
    "soal": [
      {
        "soal": "Sebuah dadu setimbang dilempar satu kali. Jika diketahui hasilnya adalah angka genap, berapa peluang muncul angka lebih dari 3?",
        "jawaban": "2/3",
        "pembahasan": "Karena sudah diketahui hasilnya genap, ruang sampel dipersempit menjadi {2, 4, 6} (3 anggota). Angka genap yang lebih dari 3 adalah {4, 6} (2 anggota). Jadi P(lebih dari 3 | genap) = 2/3."
      },
      {
        "soal": "Diketahui peluang kejadian A adalah P(A) = 0,6 dan peluang kedua kejadian terjadi bersama P(A dan B) = 0,24. Tentukan peluang bersyarat P(B | A).",
        "jawaban": "0,4",
        "pembahasan": "Gunakan rumus P(B | A) = P(A dan B) / P(A). Substitusi: P(B | A) = 0,24 / 0,6 = 0,4."
      },
      {
        "soal": "Dari 150 siswa, terdapat 90 laki-laki dan 60 perempuan. Dari 90 laki-laki, 54 ikut ekskul; dari 60 perempuan, 36 ikut ekskul. Jika dipilih satu siswa secara acak dari yang ikut ekskul, berapa peluang siswa itu perempuan?",
        "jawaban": "2/5",
        "pembahasan": "Total siswa yang ikut ekskul = 54 + 36 = 90. Di antaranya, perempuan yang ikut ekskul = 36. Maka P(perempuan | ikut ekskul) = 36/90 = 2/5 = 0,4."
      },
      {
        "soal": "Sebuah kantong berisi 7 kelereng: 3 hijau dan 4 kuning. Diambil dua kelereng satu per satu tanpa pengembalian. Berapa peluang kedua kelereng yang terambil berwarna hijau?",
        "jawaban": "1/7",
        "pembahasan": "Gunakan aturan perkalian: P(hijau1 dan hijau2) = P(hijau1) x P(hijau2 | hijau1). Peluang hijau pertama = 3/7. Setelah satu hijau terambil, sisa 2 hijau dari 6 kelereng, jadi P(hijau kedua | hijau pertama) = 2/6. Hasil: 3/7 x 2/6 = 6/42 = 1/7."
      },
      {
        "soal": "Di sebuah pabrik, mesin A memproduksi 60% barang dan mesin B memproduksi 40% barang. Persentase barang cacat dari mesin A adalah 2% dan dari mesin B adalah 5%. Jika diambil satu barang secara acak dan ternyata cacat, berapa peluang barang itu berasal dari mesin A?",
        "jawaban": "3/8",
        "pembahasan": "Gunakan Teorema Bayes. Peluang total cacat: P(cacat) = P(A)xP(cacat|A) + P(B)xP(cacat|B) = 0,6x0,02 + 0,4x0,05 = 0,012 + 0,020 = 0,032. Maka P(A | cacat) = P(A dan cacat) / P(cacat) = 0,012 / 0,032 = 3/8 = 0,375."
      }
    ]
  },
  {
    "id": "sma-f-keuangan",
    "jenjang": "SMA",
    "fase": "Fase F",
    "bidang": "Bilangan",
    "topik": "Matematika keuangan: bunga majemuk & anuitas",
    "judul": "Bunga Majemuk & Anuitas",
    "blurb": "Yuk pelajari bagaimana uang bisa bertumbuh lewat bunga majemuk dan cara menghitung cicilan pinjaman lewat anuitas!",
    "xp": 95,
    "soal": [
      {
        "soal": "Modal Rp1.000.000 ditabung dengan bunga majemuk 10% per tahun selama 2 tahun. Tentukan nilai akhir tabungan.",
        "jawaban": "Rp1.210.000",
        "pembahasan": "Gunakan M = M0 x (1 + i)^n dengan M0 = 1.000.000, i = 0,1, n = 2. M = 1.000.000 x (1,1)^2 = 1.000.000 x 1,21 = 1.210.000."
      },
      {
        "soal": "Uang Rp5.000.000 disimpan dengan bunga majemuk 8% per tahun selama 3 tahun. Tentukan total bunga yang diperoleh.",
        "jawaban": "Rp1.298.560",
        "pembahasan": "Nilai akhir = 5.000.000 x (1,08)^3 = 5.000.000 x 1,259712 = 6.298.560. Total bunga = nilai akhir - modal = 6.298.560 - 5.000.000 = 1.298.560."
      },
      {
        "soal": "Berapa uang yang harus ditabung sekarang (nilai tunai) agar 3 tahun lagi menjadi Rp13.310.000, jika bunga majemuk 10% per tahun?",
        "jawaban": "Rp10.000.000",
        "pembahasan": "Dari M = M0 x (1 + i)^n, maka M0 = M / (1 + i)^n = 13.310.000 / (1,1)^3 = 13.310.000 / 1,331 = 10.000.000."
      },
      {
        "soal": "Modal Rp1.000.000 ditabung dengan bunga majemuk 20% per tahun. Setelah berapa tahun (bilangan bulat) jumlahnya pertama kali melebihi Rp2.000.000? (gunakan log 2 = 0,3010 dan log 1,2 = 0,0792)",
        "jawaban": "4 tahun",
        "pembahasan": "Syarat: (1,2)^n > 2, sehingga n > log 2 / log 1,2 = 0,3010 / 0,0792 = 3,80. Karena n bulat, n = 4. Cek: (1,2)^3 = 1,728 (belum cukup), (1,2)^4 = 2,0736 (sudah > 2)."
      },
      {
        "soal": "Pinjaman Rp10.000.000 dilunasi dengan anuitas tahunan selama 3 tahun dan bunga majemuk 10% per tahun. Tentukan besar anuitas dan sisa pinjaman setelah pembayaran pertama.",
        "jawaban": "Anuitas ≈ Rp4.021.148; sisa pinjaman ≈ Rp6.978.852",
        "pembahasan": "Anuitas A = M x i / (1 - (1 + i)^-n) = 10.000.000 x 0,1 / (1 - (1,1)^-3) = 1.000.000 / 0,248685 ≈ 4.021.148. Pada tahun 1: bunga = 10% x 10.000.000 = 1.000.000, angsuran pokok = 4.021.148 - 1.000.000 = 3.021.148. Sisa pinjaman = 10.000.000 - 3.021.148 = 6.978.852."
      }
    ]
  },
  {
    "id": "sma-fl-polinomial",
    "jenjang": "SMA",
    "fase": "Fase F+",
    "bidang": "Aljabar",
    "topik": "Polinomial (suku banyak)",
    "judul": "Polinomial (Suku Banyak)",
    "blurb": "Yuk kenalan dengan polinomial: bentuk aljabar berpangkat yang jadi kunci untuk membagi, memfaktorkan, dan mencari akar persamaan!",
    "xp": 90,
    "soal": [
      {
        "soal": "Diketahui polinomial P(x) = 2x^3 - 3x^2 + 5x - 1. Tentukan nilai P(2).",
        "jawaban": "13",
        "pembahasan": "Substitusi x = 2: P(2) = 2(2)^3 - 3(2)^2 + 5(2) - 1 = 2(8) - 3(4) + 10 - 1 = 16 - 12 + 10 - 1 = 13."
      },
      {
        "soal": "Tentukan sisa pembagian P(x) = x^3 + 2x^2 - 5x + 3 oleh (x - 2).",
        "jawaban": "9",
        "pembahasan": "Menurut teorema sisa, sisa pembagian oleh (x - a) sama dengan P(a). Di sini a = 2, jadi sisa = P(2) = (2)^3 + 2(2)^2 - 5(2) + 3 = 8 + 8 - 10 + 3 = 9."
      },
      {
        "soal": "Jika (x - 1) merupakan faktor dari P(x) = 2x^3 - 3x^2 + ax - 2, tentukan nilai a.",
        "jawaban": "a = 3",
        "pembahasan": "Menurut teorema faktor, (x - 1) faktor berarti P(1) = 0. Substitusi: 2(1)^3 - 3(1)^2 + a(1) - 2 = 2 - 3 + a - 2 = a - 3 = 0, sehingga a = 3."
      },
      {
        "soal": "Persamaan x^3 - 6x^2 + 11x - 6 = 0 mempunyai akar-akar x1, x2, x3. Tentukan nilai x1 + x2 + x3, hasil kali x1*x2*x3, dan x1^2 + x2^2 + x3^2.",
        "jawaban": "Jumlah = 6; hasil kali = 6; jumlah kuadrat = 14",
        "pembahasan": "Dengan rumus Vieta untuk ax^3 + bx^2 + cx + d = 0: jumlah akar = -b/a = 6, jumlah perkalian dua-dua = c/a = 11, hasil kali akar = -d/a = 6. Untuk jumlah kuadrat pakai identitas x1^2 + x2^2 + x3^2 = (x1+x2+x3)^2 - 2(x1x2 + x1x3 + x2x3) = 6^2 - 2(11) = 36 - 22 = 14."
      },
      {
        "soal": "Suatu polinomial P(x) jika dibagi (x - 1) bersisa 3, dan jika dibagi (x + 2) bersisa -3. Tentukan sisa pembagian P(x) oleh (x - 1)(x + 2).",
        "jawaban": "2x + 1",
        "pembahasan": "Pembagi berderajat 2, maka sisa berbentuk ax + b. Tulis P(x) = (x - 1)(x + 2)*H(x) + ax + b. Dari teorema sisa: P(1) = a + b = 3 dan P(-2) = -2a + b = -3. Kurangkan kedua persamaan: (a + b) - (-2a + b) = 3 - (-3), yaitu 3a = 6 sehingga a = 2. Maka b = 3 - a = 1. Jadi sisanya 2x + 1."
      }
    ]
  },
  {
    "id": "sma-fl-matriks-vektor",
    "jenjang": "SMA",
    "fase": "Fase F+",
    "bidang": "Aljabar",
    "topik": "Matriks & vektor",
    "judul": "Matriks & Vektor",
    "blurb": "Yuk kenalan dengan matriks dan vektor, alat aljabar keren yang dipakai dari grafika komputer sampai fisika!",
    "xp": 95,
    "soal": [
      {
        "soal": "Diketahui matriks A = [[2, 1], [3, 4]] dan B = [[1, 0], [2, 5]]. Tentukan A + B.",
        "jawaban": "[[3, 1], [5, 9]]",
        "pembahasan": "Jumlahkan elemen yang seletak (posisinya sama): 2+1=3, 1+0=1, 3+2=5, 4+5=9. Jadi A + B = [[3, 1], [5, 9]]."
      },
      {
        "soal": "Tentukan determinan dari matriks A = [[3, 2], [1, 4]].",
        "jawaban": "10",
        "pembahasan": "Untuk matriks 2x2 berbentuk [[a, b], [c, d]], det A = ad - bc. Maka det A = (3)(4) - (2)(1) = 12 - 2 = 10."
      },
      {
        "soal": "Diketahui A = [[1, 2], [0, 3]] dan B = [[2, 1], [1, 4]]. Tentukan hasil kali AB.",
        "jawaban": "[[4, 9], [3, 12]]",
        "pembahasan": "Kalikan tiap baris A dengan tiap kolom B. Baris 1: (1)(2)+(2)(1)=4 dan (1)(1)+(2)(4)=9. Baris 2: (0)(2)+(3)(1)=3 dan (0)(1)+(3)(4)=12. Jadi AB = [[4, 9], [3, 12]]."
      },
      {
        "soal": "Diketahui vektor a = (2, 2) dan b = (0, 3). Tentukan besar sudut antara vektor a dan b.",
        "jawaban": "45 derajat",
        "pembahasan": "Gunakan cos t = (a . b) / (|a| |b|). Hasil kali titik a . b = (2)(0) + (2)(3) = 6. Panjang |a| = akar(2^2 + 2^2) = akar(8) = 2 akar(2), dan |b| = 3. Maka cos t = 6 / (2 akar(2) . 3) = 6 / (6 akar(2)) = 1/akar(2), sehingga t = 45 derajat."
      },
      {
        "soal": "Selesaikan sistem persamaan 2x + y = 5 dan x + 3y = 10 menggunakan invers matriks.",
        "jawaban": "x = 1, y = 3",
        "pembahasan": "Tulis dalam bentuk A X = B dengan A = [[2, 1], [1, 3]] dan B = (5, 10). det A = (2)(3) - (1)(1) = 5. Invers A = (1/5) [[3, -1], [-1, 2]]. Maka X = A^-1 B: x = (1/5)((3)(5) + (-1)(10)) = (1/5)(5) = 1; y = (1/5)((-1)(5) + (2)(10)) = (1/5)(15) = 3. Cek: 2(1)+3=5 dan 1+3(3)=10, benar. Jadi x = 1 dan y = 3."
      }
    ]
  },
  {
    "id": "sma-fl-fungsi-trig",
    "jenjang": "SMA",
    "fase": "Fase F+",
    "bidang": "Trigonometri",
    "topik": "Fungsi trigonometri: persamaan & rumus analitik",
    "judul": "Persamaan Trigonometri & Rumus Analitik",
    "blurb": "Yuk pecahkan persamaan trigonometri langkah demi langkah, dari sin sederhana sampai bentuk a sin x + b cos x!",
    "xp": 95,
    "soal": [
      {
        "soal": "Tentukan semua nilai x untuk 0 <= x < 360 derajat yang memenuhi sin x = 1/2.",
        "jawaban": "x = 30 derajat atau x = 150 derajat",
        "pembahasan": "sin x = 1/2 = sin 30. Sinus positif di kuadran I dan II. Kuadran I: x = 30. Kuadran II: x = 180 - 30 = 150. Jadi x = 30 atau x = 150."
      },
      {
        "soal": "Tentukan semua nilai x untuk 0 <= x < 360 derajat yang memenuhi cos x = -1/2.",
        "jawaban": "x = 120 derajat atau x = 240 derajat",
        "pembahasan": "Sudut acuannya 60 karena cos 60 = 1/2. Karena hasilnya negatif, x di kuadran II dan III. Kuadran II: x = 180 - 60 = 120. Kuadran III: x = 180 + 60 = 240. Jadi x = 120 atau x = 240."
      },
      {
        "soal": "Tentukan semua nilai x untuk 0 <= x < 360 derajat yang memenuhi 2 sin^2 x - sin x - 1 = 0.",
        "jawaban": "x = 90 derajat, 210 derajat, atau 330 derajat",
        "pembahasan": "Misalkan u = sin x, maka 2u^2 - u - 1 = 0. Faktorkan: (2u + 1)(u - 1) = 0, sehingga u = -1/2 atau u = 1. Untuk sin x = 1: x = 90. Untuk sin x = -1/2 (kuadran III dan IV): x = 180 + 30 = 210 dan x = 360 - 30 = 330. Jadi x = 90, 210, 330."
      },
      {
        "soal": "Dengan memakai rumus sin 2x = 2 sin x cos x, tentukan semua x untuk 0 <= x < 360 derajat yang memenuhi sin 2x = sin x.",
        "jawaban": "x = 0 derajat, 60 derajat, 180 derajat, atau 300 derajat",
        "pembahasan": "sin 2x - sin x = 0. Ganti sin 2x = 2 sin x cos x sehingga 2 sin x cos x - sin x = 0. Faktorkan: sin x (2 cos x - 1) = 0. Dari sin x = 0: x = 0 atau 180. Dari cos x = 1/2: x = 60 atau x = 360 - 60 = 300. Jadi x = 0, 60, 180, 300."
      },
      {
        "soal": "Ubah ke bentuk R sin(x + a), lalu tentukan semua x untuk 0 <= x < 360 derajat yang memenuhi sin x + akar(3) cos x = 1.",
        "jawaban": "x = 90 derajat atau x = 330 derajat",
        "pembahasan": "Bentuk a sin x + b cos x = R sin(x + a) dengan R = akar(a^2 + b^2) = akar(1 + 3) = 2, dan tan a = b/a = akar(3), sehingga a = 60. Persamaan menjadi 2 sin(x + 60) = 1, jadi sin(x + 60) = 1/2. Karena 0 <= x < 360 maka 60 <= x + 60 < 420, sehingga x + 60 = 150 atau x + 60 = 390. Dari x + 60 = 150: x = 90. Dari x + 60 = 390: x = 330. Cek: untuk x = 90 hasilnya 1 + 0 = 1; untuk x = 330 hasilnya -1/2 + 3/2 = 1. Jadi x = 90 atau 330."
      }
    ]
  },
  {
    "id": "sma-fl-limit",
    "jenjang": "SMA",
    "fase": "Fase F+",
    "bidang": "Kalkulus",
    "topik": "Limit fungsi aljabar & trigonometri",
    "judul": "Limit Fungsi Aljabar & Trigonometri",
    "blurb": "Yuk cari tahu ke mana nilai fungsi \"menuju\" saat x mendekati suatu titik, lewat trik substitusi, faktor, dan sin/cos!",
    "xp": 95,
    "soal": [
      {
        "soal": "Tentukan nilai dari lim x->2 (3x + 1).",
        "jawaban": "7",
        "pembahasan": "Fungsi 3x + 1 kontinu, jadi limit dicari dengan substitusi langsung: 3(2) + 1 = 6 + 1 = 7."
      },
      {
        "soal": "Tentukan nilai dari lim x->3 (x^2 - 9)/(x - 3).",
        "jawaban": "6",
        "pembahasan": "Substitusi langsung memberi 0/0 (bentuk tak tentu). Faktorkan pembilang: x^2 - 9 = (x - 3)(x + 3). Coret (x - 3), sisa (x + 3). Substitusi x = 3: 3 + 3 = 6."
      },
      {
        "soal": "Tentukan nilai dari lim x->4 (akar(x) - 2)/(x - 4).",
        "jawaban": "1/4",
        "pembahasan": "Bentuk 0/0. Kalikan pembilang dan penyebut dengan sekawan (akar(x) + 2): pembilang menjadi (akar(x))^2 - 2^2 = x - 4. Jadi (x - 4)/[(x - 4)(akar(x) + 2)] = 1/(akar(x) + 2). Substitusi x = 4: 1/(2 + 2) = 1/4."
      },
      {
        "soal": "Tentukan nilai dari lim x->0 sin(3x)/(2x).",
        "jawaban": "3/2",
        "pembahasan": "Gunakan limit dasar lim u->0 sin(u)/u = 1. Tulis sin(3x)/(2x) = (3/2) . sin(3x)/(3x). Saat x->0, sin(3x)/(3x) -> 1, sehingga hasilnya (3/2)(1) = 3/2."
      },
      {
        "soal": "Tentukan nilai dari lim x->0 (tan(2x) - sin(2x))/x^3.",
        "jawaban": "4",
        "pembahasan": "Tulis tan(2x) - sin(2x) = sin(2x)/cos(2x) - sin(2x) = sin(2x)(1 - cos(2x))/cos(2x). Bagi dengan x^3 dan pecah: [sin(2x)/x] . [(1 - cos(2x))/x^2] . [1/cos(2x)]. Saat x->0: sin(2x)/x -> 2; (1 - cos(2x))/x^2 -> 2 (pakai 1 - cos(2x) = 2 sin^2(x), sehingga 2 sin^2(x)/x^2 -> 2); 1/cos(2x) -> 1. Hasil = 2 . 2 . 1 = 4."
      }
    ]
  },
  {
    "id": "sma-fl-kalkulus",
    "jenjang": "SMA",
    "fase": "Fase F+",
    "bidang": "Kalkulus",
    "topik": "Turunan & integral fungsi aljabar & trigonometri",
    "judul": "Turunan & Integral: Aljabar dan Trigonometri",
    "blurb": "Yuk kuasai turunan dan integral fungsi aljabar sekaligus trigonometri, kunci utama Kalkulus di SMA!",
    "xp": 92,
    "soal": [
      {
        "soal": "Tentukan turunan pertama dari fungsi f(x) = x^4 - 3x^2 + 6.",
        "jawaban": "f'(x) = 4x^3 - 6x",
        "pembahasan": "Gunakan aturan pangkat: turunan x^n adalah n*x^(n-1). Turunan x^4 = 4x^3, turunan -3x^2 = -6x, dan turunan konstanta 6 = 0. Jadi f'(x) = 4x^3 - 6x."
      },
      {
        "soal": "Tentukan turunan pertama dari fungsi f(x) = 3 sin x + 2 cos x.",
        "jawaban": "f'(x) = 3 cos x - 2 sin x",
        "pembahasan": "Turunan sin x = cos x dan turunan cos x = -sin x. Maka turunan 3 sin x = 3 cos x dan turunan 2 cos x = -2 sin x. Jadi f'(x) = 3 cos x - 2 sin x."
      },
      {
        "soal": "Tentukan hasil integral tak tentu dari (6x^2 - 4x + 5) dx.",
        "jawaban": "2x^3 - 2x^2 + 5x + C",
        "pembahasan": "Gunakan aturan integral pangkat: integral x^n = x^(n+1)/(n+1). Integral 6x^2 = 6*x^3/3 = 2x^3, integral -4x = -4*x^2/2 = -2x^2, dan integral 5 = 5x. Tambahkan konstanta C, sehingga hasilnya 2x^3 - 2x^2 + 5x + C."
      },
      {
        "soal": "Tentukan hasil integral tak tentu dari sin(3x) dx.",
        "jawaban": "-1/3 cos(3x) + C",
        "pembahasan": "Karena integral sin x = -cos x, gunakan substitusi u = 3x sehingga du = 3 dx atau dx = du/3. Integralnya menjadi (1/3)*integral sin u du = (1/3)*(-cos u) = -1/3 cos(3x) + C."
      },
      {
        "soal": "Tentukan turunan pertama dari fungsi f(x) = x^2 cos x.",
        "jawaban": "f'(x) = 2x cos x - x^2 sin x",
        "pembahasan": "Fungsi berbentuk hasil kali, gunakan aturan perkalian: (u*v)' = u'*v + u*v'. Misalkan u = x^2 (maka u' = 2x) dan v = cos x (maka v' = -sin x). Jadi f'(x) = 2x*cos x + x^2*(-sin x) = 2x cos x - x^2 sin x."
      }
    ]
  },
  {
    "id": "sma-fl-geometri-ruang",
    "jenjang": "SMA",
    "fase": "Fase F+",
    "bidang": "Geometri",
    "topik": "Geometri ruang (dimensi tiga): jarak titik ke titik, garis, dan bidang",
    "judul": "Jarak di Ruang Dimensi Tiga",
    "blurb": "Yuk ukur jarak titik ke titik, garis, dan bidang di ruang lewat kubus dan limas, satu langkah lebih dekat jadi jago geometri!",
    "xp": 95,
    "soal": [
      {
        "soal": "Diketahui titik P(1, 2, 2) dan Q(4, 6, 2) pada ruang. Tentukan jarak antara titik P dan Q.",
        "jawaban": "5 satuan",
        "pembahasan": "Pakai rumus jarak dua titik: PQ = akar((4-1)^2 + (6-2)^2 + (2-2)^2) = akar(9 + 16 + 0) = akar(25) = 5."
      },
      {
        "soal": "Kubus ABCD.EFGH memiliki panjang rusuk 4 cm. Tentukan jarak titik A ke titik G (diagonal ruang).",
        "jawaban": "4 akar(3) cm",
        "pembahasan": "AG adalah diagonal ruang. AG^2 = AC^2 + CG^2, dengan AC = diagonal bidang = 4 akar(2) dan CG = rusuk = 4. Jadi AG^2 = (4 akar(2))^2 + 4^2 = 32 + 16 = 48, sehingga AG = akar(48) = 4 akar(3) cm. (Rumus cepat: diagonal ruang = rusuk x akar(3).)"
      },
      {
        "soal": "Kubus ABCD.EFGH memiliki rusuk 6 cm. Tentukan jarak titik A ke garis CE.",
        "jawaban": "2 akar(6) cm",
        "pembahasan": "Tinjau segitiga ACE. Karena AE tegak lurus alas, maka AE tegak lurus AC (siku-siku di A). Sisi: AC = 6 akar(2), AE = 6, CE = diagonal ruang = 6 akar(3). Luas segitiga = 1/2 x AC x AE = 1/2 x 6 akar(2) x 6 = 18 akar(2). Jarak A ke CE (d) memenuhi Luas = 1/2 x CE x d, jadi 18 akar(2) = 1/2 x 6 akar(3) x d, maka d = 36 akar(2) / (6 akar(3)) = 6 akar(2)/akar(3) = 2 akar(6) cm."
      },
      {
        "soal": "Kubus ABCD.EFGH memiliki rusuk 6 cm. Tentukan jarak titik A ke bidang BDE.",
        "jawaban": "2 akar(3) cm",
        "pembahasan": "Ambil koordinat A(0,0,0), B(6,0,0), D(0,6,0), E(0,0,6). Bidang BDE melalui ketiga titik itu berpersamaan x + y + z = 6. Jarak titik ke bidang = |0 + 0 + 0 - 6| / akar(1^2 + 1^2 + 1^2) = 6/akar(3) = 2 akar(3) cm. (Secara geometri: diagonal ruang AG tegak lurus bidang BDE dan jarak = 1/3 x AG = 1/3 x 6 akar(3) = 2 akar(3).)"
      },
      {
        "soal": "Limas beraturan T.ABCD memiliki alas persegi ABCD dengan sisi 8 cm dan tinggi limas TO = 6 cm (O pusat alas). Tentukan jarak titik O ke bidang sisi tegak TBC.",
        "jawaban": "12 akar(13)/13 cm (sekitar 3,33 cm)",
        "pembahasan": "Misal P titik tengah BC. Jarak O ke sisi alas BC adalah apotema = setengah sisi = 4 cm, jadi OP = 4 dan OP tegak lurus BC. Karena TO tegak lurus alas, segitiga TOP siku-siku di O dengan OT = 6. Maka TP = akar(4^2 + 6^2) = akar(52) = 2 akar(13). Karena BC tegak lurus OP dan BC tegak lurus TO, maka BC tegak lurus bidang TOP, sehingga bidang TOP tegak lurus bidang TBC dengan garis potong TP. Jarak O ke bidang TBC = jarak O ke garis TP = (OP x OT)/TP = (4 x 6)/(2 akar(13)) = 12/akar(13) = 12 akar(13)/13 kira-kira 3,33 cm."
      }
    ]
  }
];

export type DuniaGroup = {
  key: string;
  jenjang: string;
  fase: string;
  topik: TopikSoal[];
};

// Kelompokkan per Dunia (jenjang + fase), urut dari SD ke SMA.
export function bankByDunia(): DuniaGroup[] {
  const order = ["SD|Fase A", "SD|Fase B", "SD|Fase C", "SMP|Fase D", "SMA|Fase F", "SMA|Fase F+"];
  const map = new Map<string, TopikSoal[]>();
  for (const t of bankSoal) {
    const key = t.jenjang + "|" + t.fase;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  return order
    .filter((k) => map.has(k))
    .map((k) => {
      const [jenjang, fase] = k.split("|");
      return { key: k, jenjang, fase, topik: map.get(k)! };
    });
}

export function topikById(id: string): TopikSoal | undefined {
  return bankSoal.find((t) => t.id === id);
}
