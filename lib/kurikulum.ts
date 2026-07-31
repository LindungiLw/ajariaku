// Gudang materi (sumber RAG). Murid AI HANYA boleh bersandar pada materi ini
// supaya jawabannya akurat & "sesuai pelajaran", bukan mengarang.
// Field `miskonsepsi` = kesalahan umum siswa → dipakai murid AI untuk membuat
// kekeliruan yang realistis (agar bisa dikoreksi) & untuk deteksi gap di rapor.
//
// Sebagian besar entri di bawah ditulis + diverifikasi kebenarannya lewat
// pipeline multi-agen (tulis → guru pemeriksa). Tim tinggal menambah/menyunting.

export type Materi = {
  id: string;
  topik: string;
  konsep: string;
  konten: string;
  contoh: string;
  miskonsepsi?: string;
};

export const kurikulum: Materi[] = [
  // Aljabar dasar (inti demo "2x + 3 = 11")
  {
    id: "alj-pindah-ruas",
    topik: "Aljabar",
    konsep: "Pindah ruas (transposisi)",
    konten:
      "Suku yang dipindah ke ruas lain berganti tanda: + menjadi −, − menjadi +, × menjadi ÷, dan ÷ menjadi ×. Tujuannya mengisolasi variabel di satu ruas.",
    contoh: "2x + 3 = 11 → 2x = 11 − 3 → 2x = 8.",
    miskonsepsi:
      "Siswa lupa mengganti tanda saat memindah ruas, dari 2x + 3 = 11 menulis 2x = 11 + 3 (harusnya 11 − 3).",
  },
  {
    id: "alj-operasi-kebalikan",
    topik: "Aljabar",
    konsep: "Operasi kebalikan",
    konten:
      "Untuk melepas angka yang menempel pada variabel, lakukan operasi kebalikannya pada kedua ruas. Kebalikan kali adalah bagi; kebalikan tambah adalah kurang.",
    contoh: "2x = 8 → x = 8 ÷ 2 = 4 (bukan 8 − 2).",
    miskonsepsi:
      "Siswa mengurangi alih-alih membagi, dari 2x = 8 menulis x = 8 − 2 = 6, padahal x = 8 ÷ 2 = 4.",
  },
  {
    id: "alj-verifikasi",
    topik: "Aljabar",
    konsep: "Verifikasi jawaban",
    konten:
      "Cek jawaban dengan memasukkan kembali nilai variabel ke persamaan awal. Jika kedua ruas sama, jawaban benar.",
    contoh: "x = 4 → 2(4) + 3 = 8 + 3 = 11 ✓ sama dengan ruas kanan.",
    miskonsepsi:
      "Siswa menganggap selesai tanpa mengecek, atau salah saat menyubstitusikan kembali nilai x ke persamaan.",
  },
  {
    id: "bil-urutan-operasi",
    topik: "Bilangan",
    konsep: "Urutan operasi",
    konten:
      "Kerjakan sesuai urutan: kurung dulu, lalu pangkat/akar, kemudian kali/bagi (kiri ke kanan), terakhir tambah/kurang.",
    contoh: "2 + 3 × 4 = 2 + 12 = 14 (bukan 20).",
    miskonsepsi:
      "Siswa mengerjakan murni dari kiri ke kanan tanpa mendahulukan kali/bagi, menganggap 2 + 3 × 4 = 20.",
  },

  // Eksponen & Logaritma
  {
    id: "eksponen",
    topik: "Eksponen & Logaritma",
    konsep: "Bilangan berpangkat (eksponen)",
    konten:
      "Bilangan berpangkat a^n berarti perkalian berulang a sebanyak n kali (a^n = a x a x ... x a). Aturan pentingnya: a^m x a^n = a^(m+n), a^m : a^n = a^(m-n), (a^m)^n = a^(m x n), a^0 = 1 (a tidak 0), dan a^(-n) = 1/a^n.",
    contoh:
      "Sederhanakan 2^5 x 2^3 : 2^4. Langkah: 2^(5+3) = 2^8, lalu 2^(8-4) = 2^4 = 16. Hasil = 16.",
    miskonsepsi:
      "Siswa sering mengalikan basis saat pangkat dijumlahkan, misalnya menganggap 2^3 x 2^2 = 4^5. Padahal basis tetap dan pangkatnya yang dijumlah: 2^3 x 2^2 = 2^5 = 32.",
  },
  {
    id: "bentuk-akar",
    topik: "Eksponen & Logaritma",
    konsep: "Bentuk akar (radikal)",
    konten:
      "Bentuk akar (radikal) adalah akar dari suatu bilangan yang hasilnya bukan bilangan rasional, misalnya akar(2) atau akar(3). Untuk a, b >= 0 berlaku sifat akar(a x b) = akar(a) x akar(b), yang dipakai untuk menyederhanakan bentuk akar dengan memisahkan faktor kuadrat sempurna.",
    contoh:
      "Sederhanakan akar(72). Cari faktor kuadrat sempurna terbesar: 72 = 36 x 2. Maka akar(72) = akar(36 x 2) = akar(36) x akar(2) = 6 akar(2). Hasil akhir: 6 akar(2).",
    miskonsepsi:
      "Siswa sering mengira akar(a + b) = akar(a) + akar(b). Ini salah: cek akar(9 + 16) = akar(25) = 5, sedangkan akar(9) + akar(16) = 3 + 4 = 7. Sifat perkalian akar TIDAK berlaku untuk penjumlahan.",
  },
  {
    id: "logaritma",
    topik: "Eksponen & Logaritma",
    konsep: "Logaritma",
    konten:
      'Logaritma adalah kebalikan (invers) dari eksponen. Notasi "a log b = c" berarti a^c = b, dengan syarat basis a > 0, a tidak sama dengan 1, dan bilangan b > 0.',
    contoh:
      "Hitung 2 log 8. Kita cari pangkat berapa dari 2 supaya hasilnya 8. Karena 2^3 = 8, maka 2 log 8 = 3.",
    miskonsepsi:
      "Siswa sering mengira log(a + b) = log a + log b. Ini salah. Yang benar adalah untuk perkalian: a log (m . n) = a log m + a log n. Penjumlahan di dalam logaritma tidak bisa dipecah menjadi jumlah dua logaritma.",
  },

  // Aljabar lanjut
  {
    id: "pers-linear",
    topik: "Aljabar",
    konsep: "Persamaan linear satu variabel",
    konten:
      "Persamaan linear satu variabel (PLSV) adalah kalimat matematika yang memakai tanda sama dengan dan memuat satu variabel berpangkat satu, misalnya bentuk ax + b = c dengan a bukan nol. Menyelesaikannya berarti mencari nilai variabel yang membuat ruas kiri sama dengan ruas kanan, dengan cara melakukan operasi yang sama pada kedua ruas.",
    contoh:
      "Selesaikan 2x + 5 = 11. Kurangi kedua ruas dengan 5: 2x = 6. Bagi kedua ruas dengan 2: x = 3. Cek: 2(3) + 5 = 11 (benar). Jadi x = 3.",
    miskonsepsi:
      "Siswa sering lupa mengubah tanda saat memindahkan suku ke ruas lain, misalnya dari 2x + 5 = 11 langsung menulis 2x = 11 + 5. Padahal suku +5 yang berpindah ruas harus menjadi -5, sehingga yang benar 2x = 11 - 5.",
  },
  {
    id: "pert-linear",
    topik: "Aljabar",
    konsep: "Pertidaksamaan linear",
    konten:
      "Pertidaksamaan linear adalah kalimat matematika yang menghubungkan dua bentuk linear dengan tanda <, >, ≤, atau ≥. Cara menyelesaikannya mirip persamaan linear, tetapi ada aturan khusus: jika kedua ruas dikali atau dibagi bilangan NEGATIF, tanda pertidaksamaan harus dibalik.",
    contoh:
      "Selesaikan -2x + 3 < 7. Kurangi 3 kedua ruas: -2x < 4. Bagi kedua ruas dengan -2 (negatif, jadi tanda dibalik): x > -2. Hasil akhir: x > -2.",
    miskonsepsi:
      "Siswa lupa membalik tanda pertidaksamaan saat mengali atau membagi kedua ruas dengan bilangan negatif, sehingga menulis x < -2 padahal seharusnya x > -2.",
  },
  {
    id: "spldv",
    topik: "Sistem Persamaan",
    konsep: "Sistem persamaan linear dua variabel (SPLDV)",
    konten:
      "SPLDV adalah gabungan dua persamaan linear yang masing-masing memuat dua variabel (misal x dan y); penyelesaiannya adalah pasangan nilai (x, y) yang membuat KEDUA persamaan benar sekaligus. Dapat diselesaikan dengan metode substitusi, eliminasi, atau gabungan keduanya.",
    contoh:
      "Selesaikan: 2x + y = 8 dan x - y = 1. Eliminasi y (tandanya berlawanan, jadi kedua persamaan dijumlahkan): (2x + y) + (x - y) = 8 + 1, sehingga 3x = 9 -> x = 3. Substitusi ke x - y = 1: 3 - y = 1 -> y = 2. Hasil: x = 3 dan y = 2. Cek: 2(3) + 2 = 8 (benar).",
    miskonsepsi:
      "Saat eliminasi, siswa sering salah memilih operasi: koefisien yang bertanda SAMA harus dikurangkan, sedangkan yang bertanda BERBEDA dijumlahkan. Banyak yang asal menjumlahkan sehingga variabelnya tidak hilang, atau berhenti setelah menemukan satu variabel dan lupa mencari nilai variabel keduanya.",
  },
  {
    id: "pers-kuadrat",
    topik: "Persamaan Kuadrat",
    konsep: "Persamaan kuadrat (pemfaktoran & rumus abc)",
    konten:
      "Persamaan kuadrat adalah persamaan berbentuk ax^2 + bx + c = 0 dengan a bukan 0. Akarnya dapat dicari dengan pemfaktoran (mencari dua bilangan yang jumlahnya b dan hasil kalinya a*c) atau dengan rumus abc: x = (-b ± akar(b^2 - 4ac)) / (2a).",
    contoh:
      "Selesaikan x^2 - 5x + 6 = 0. Cari dua bilangan yang jumlahnya -5 dan hasil kalinya 6, yaitu -2 dan -3. Faktornya (x - 2)(x - 3) = 0, sehingga x - 2 = 0 atau x - 3 = 0. Hasil: x = 2 atau x = 3.",
    miskonsepsi:
      "Siswa sering langsung memfaktorkan padahal ruas kanan belum dijadikan nol. Contoh: dari x^2 - 5x = 6 mereka memfaktorkan x(x - 5) = 6 lalu menulis x = 6 atau x - 5 = 6, padahal persamaan harus diubah dulu menjadi x^2 - 5x - 6 = 0 sebelum difaktorkan.",
  },
  {
    id: "fungsi-kuadrat",
    topik: "Fungsi Kuadrat",
    konsep: "Fungsi kuadrat & grafik parabola",
    konten:
      "Fungsi kuadrat berbentuk f(x) = ax^2 + bx + c dengan a tidak sama dengan 0, dan grafiknya berupa parabola. Parabola terbuka ke atas jika a > 0 (punya titik minimum) dan terbuka ke bawah jika a < 0 (punya titik maksimum), dengan titik puncak di x = -b/(2a).",
    contoh:
      "Cari titik puncak dari f(x) = x^2 - 4x + 3. Karena a = 1, b = -4, maka x = -b/(2a) = -(-4)/(2.1) = 4/2 = 2. Nilai y = f(2) = 2^2 - 4.2 + 3 = 4 - 8 + 3 = -1. Jadi titik puncaknya (2, -1), dan karena a > 0 parabola terbuka ke atas sehingga (2, -1) adalah titik minimum.",
    miskonsepsi:
      "Siswa sering lupa tanda minus pada rumus puncak, sehingga menghitung x = b/(2a) dan mendapat x = -2 (padahal seharusnya x = -b/(2a) = 2). Selain itu banyak yang mengira nilai c langsung menjadi koordinat puncak.",
  },

  // Fungsi
  {
    id: "fungsi-komposisi",
    topik: "Fungsi",
    konsep: "Komposisi fungsi",
    konten:
      "Komposisi fungsi adalah menggabungkan dua fungsi menjadi satu, ditulis (f o g)(x) = f(g(x)), artinya hasil dari g(x) dimasukkan (disubstitusikan) ke dalam fungsi f. Kerjakan fungsi yang di dalam kurung dulu, dan urutannya penting.",
    contoh:
      "Misal f(x) = 2x + 1 dan g(x) = x^2, cari (f o g)(3). Langkah: hitung g(3) = 3^2 = 9, lalu masukkan ke f, yaitu f(9) = 2(9) + 1 = 19. Jadi (f o g)(3) = 19.",
    miskonsepsi:
      "Siswa sering mengira (f o g)(x) sama dengan (g o f)(x), padahal urutannya beda dan hasilnya biasanya tidak sama. Ada juga yang malah mengalikan f(x) kali g(x) alih-alih mensubstitusikan g ke dalam f.",
  },
  {
    id: "fungsi-invers",
    topik: "Fungsi",
    konsep: "Fungsi invers",
    konten:
      'Fungsi invers f^-1 adalah fungsi yang "membalik" kerja f: kalau f memetakan x ke y, maka f^-1 memetakan y kembali ke x. Fungsi hanya punya invers jika bersifat bijektif (satu-satu dan pada), dan cara mencarinya: tulis y = f(x), tukar posisi x dan y, lalu selesaikan untuk y.',
    contoh:
      "Cari invers dari f(x) = 2x + 3. Tulis y = 2x + 3, lalu tukar x dan y menjadi x = 2y + 3. Selesaikan: 2y = x - 3, sehingga y = (x - 3)/2. Jadi f^-1(x) = (x - 3)/2. Cek: f^-1(9) = (9 - 3)/2 = 3, dan memang f(3) = 2(3) + 3 = 9.",
    miskonsepsi:
      "Siswa sering mengira f^-1(x) berarti 1/f(x) (kebalikan/pecahan). Padahal notasi -1 di sini menandakan fungsi invers, bukan pangkat negatif; contohnya invers dari f(x) = 2x + 3 adalah (x - 3)/2, bukan 1/(2x + 3).",
  },

  // Barisan & Deret
  {
    id: "barisan-aritmetika",
    topik: "Barisan & Deret",
    konsep: "Barisan & deret aritmetika",
    konten:
      "Barisan aritmetika adalah barisan yang selisih (beda, b) antara dua suku berurutan selalu tetap, dengan rumus suku ke-n: Un = a + (n-1)b. Deret aritmetika adalah jumlah n suku pertamanya: Sn = n/2 (a + Un) atau Sn = n/2 (2a + (n-1)b).",
    contoh:
      "Barisan 3, 7, 11, 15, ... Tentukan U10 dan S10. Di sini a = 3 dan b = 7 - 3 = 4. Maka U10 = a + (n-1)b = 3 + (10-1)(4) = 3 + 36 = 39. Lalu S10 = n/2 (a + Un) = 10/2 (3 + 39) = 5 x 42 = 210.",
    miskonsepsi:
      "Siswa sering lupa memakai (n-1) dan menulis Un = a + n.b, sehingga hasilnya bergeser satu suku (mis. menghitung U10 padahal yang keluar U11).",
  },
  {
    id: "barisan-geometri",
    topik: "Barisan & Deret",
    konsep: "Barisan & deret geometri",
    konten:
      "Barisan geometri adalah barisan yang tiap suku didapat dari suku sebelumnya dikali rasio tetap (r). Rumus suku ke-n: Un = a x r^(n-1). Deret geometri (jumlah n suku pertama): Sn = a(r^n - 1)/(r - 1) untuk r > 1, atau Sn = a(1 - r^n)/(1 - r) untuk r < 1.",
    contoh:
      "Barisan 2, 6, 18, 54, ... Tentukan U5 dan S5. Di sini a = 2 dan r = 6/2 = 3. Maka U5 = a x r^(5-1) = 2 x 3^4 = 2 x 81 = 162. Lalu S5 = a(r^5 - 1)/(r - 1) = 2(243 - 1)/(3 - 1) = 2 x 242 / 2 = 242.",
    miskonsepsi:
      "Siswa sering tertukar antara beda (b, dijumlah untuk aritmetika) dan rasio (r, dikali untuk geometri), atau memakai rumus deret aritmetika untuk barisan geometri.",
  },

  // Geometri
  {
    id: "pythagoras",
    topik: "Teorema Pythagoras",
    konsep: "Teorema Pythagoras",
    konten:
      "Pada segitiga siku-siku, kuadrat sisi miring (hipotenusa) sama dengan jumlah kuadrat dua sisi lainnya, ditulis c^2 = a^2 + b^2, dengan c adalah sisi di depan sudut siku-siku (90 derajat).",
    contoh:
      "Segitiga siku-siku dengan sisi tegak a = 3 cm dan b = 4 cm. Maka c^2 = 3^2 + 4^2 = 9 + 16 = 25, sehingga c = akar(25) = 5 cm. Jadi panjang sisi miringnya 5 cm.",
    miskonsepsi:
      "Siswa sering menjumlahkan sisi tanpa dikuadratkan (mengira 3 + 4 = 7) atau salah menempatkan sisi miring; untuk mencari sisi tegak seharusnya memakai a^2 = c^2 - b^2.",
  },
  {
    id: "kesebangunan",
    topik: "Geometri",
    konsep: "Kesebangunan & kekongruenan segitiga",
    konten:
      "Dua segitiga KONGRUEN jika sisi dan sudut yang bersesuaian sama semua (bentuk sama, ukuran sama), syaratnya SSS, SAS, atau ASA/AAS. Dua segitiga SEBANGUN jika sudut bersesuaian sama besar DAN sisi bersesuaian sebanding/senilai (bentuk sama, ukuran boleh beda), syaratnya AA (dua sudut sama) atau sisi-sisi seletak berbanding sama.",
    contoh:
      "Segitiga ABC sebangun dengan DEF, dengan AB = 6 cm, BC = 8 cm, dan DE = 9 cm. Cari EF. Karena sebangun, sisi bersesuaian sebanding: AB/DE = BC/EF. 6/9 = 8/EF -> EF = (8 x 9)/6 = 72/6 = 12. Hasil: EF = 12 cm.",
    miskonsepsi:
      "Siswa mengira ketiga sudut sama besar (AAA) membuat dua segitiga KONGRUEN. Padahal sudut-sudut sama hanya menjamin SEBANGUN; ukurannya bisa berbeda, jadi belum tentu kongruen.",
  },

  // Trigonometri
  {
    id: "trig-dasar",
    topik: "Trigonometri",
    konsep: "Perbandingan trigonometri (sin, cos, tan)",
    konten:
      'Pada segitiga siku-siku, untuk sudut acuan A: sin A = sisi depan / sisi miring, cos A = sisi samping / sisi miring, dan tan A = sisi depan / sisi samping (sisi miring selalu sisi terpanjang, yaitu sisi di depan sudut siku-siku). Ingat singkatan "sindemi, cosami, tandesa".',
    contoh:
      "Segitiga siku-siku dengan sisi depan sudut A = 3 dan sisi samping = 4. Sisi miring = akar(3^2 + 4^2) = akar(9 + 16) = akar(25) = 5. Maka sin A = 3/5, cos A = 4/5, tan A = 3/4.",
    miskonsepsi:
      'Siswa sering tertukar menentukan mana "sisi depan" dan "sisi samping" karena lupa bahwa keduanya bergantung pada letak sudut acuan, bukan posisi tetap. Akibatnya nilai sin dan cos jadi terbalik.',
  },
  {
    id: "trig-sudut-istimewa",
    topik: "Trigonometri",
    konsep: "Nilai trigonometri sudut istimewa (0,30,45,60,90)",
    konten:
      "Sudut istimewa (0, 30, 45, 60, 90 derajat) punya nilai trigonometri pasti yang wajib dihafal. Untuk sinus: sin 0 = 0, sin 30 = 1/2, sin 45 = akar(2)/2, sin 60 = akar(3)/2, sin 90 = 1; nilai cosinus adalah kebalikan urutannya (cos 0 = 1, cos 30 = akar(3)/2, cos 45 = akar(2)/2, cos 60 = 1/2, cos 90 = 0); sedangkan tan = sin/cos, sehingga tan 0 = 0, tan 30 = akar(3)/3, tan 45 = 1, tan 60 = akar(3), dan tan 90 tidak terdefinisi.",
    contoh:
      "Hitung sin 30 + cos 60. Langkah: sin 30 = 1/2 dan cos 60 = 1/2, jadi 1/2 + 1/2 = 1. Hasil akhir = 1.",
    miskonsepsi:
      "Siswa sering tertukar antara nilai sin 30 dan sin 60 (menulis sin 30 = akar(3)/2, padahal sin 30 = 1/2), karena lupa bahwa makin besar sudut dari 0 sampai 90, nilai sinus makin besar sedangkan cosinus makin kecil.",
  },
  {
    id: "aturan-sinus-cosinus",
    topik: "Trigonometri",
    konsep: "Aturan sinus & aturan cosinus",
    konten:
      "Aturan sinus menyatakan a/sin A = b/sin B = c/sin C (perbandingan sisi dengan sinus sudut di hadapannya selalu sama), dipakai saat diketahui pasangan sisi-sudut yang berhadapan. Aturan cosinus menyatakan c^2 = a^2 + b^2 - 2ab cos C (dan permutasinya), dipakai saat diketahui dua sisi dan sudut apitnya, atau ketiga sisi.",
    contoh:
      "Diketahui segitiga dengan a = 5, b = 8, dan sudut apit C = 60. Cari sisi c dengan aturan cosinus: c^2 = a^2 + b^2 - 2ab cos C = 25 + 64 - 2(5)(8)(cos 60) = 89 - 80(1/2) = 89 - 40 = 49. Jadi c = akar(49) = 7.",
    miskonsepsi:
      "Siswa sering salah urutan operasi pada aturan cosinus: menghitung (a^2 + b^2 - 2ab) dulu baru dikalikan cos C. Yang benar, 2ab dikalikan cos C terlebih dahulu, lalu hasilnya baru dikurangkan dari a^2 + b^2.",
  },

  // Statistika
  {
    id: "statistika-pemusatan",
    topik: "Statistika",
    konsep: "Ukuran pemusatan (mean, median, modus)",
    konten:
      'Ukuran pemusatan adalah nilai yang mewakili "pusat" data. Mean (rata-rata) = jumlah semua data dibagi banyaknya data; median = nilai tengah setelah data diurutkan; modus = nilai yang paling sering muncul.',
    contoh:
      "Data: 4, 7, 7, 9, 3. Urutkan dulu: 3, 4, 7, 7, 9. Mean = (3+4+7+7+9)/5 = 30/5 = 6. Median = data ke-3 (paling tengah dari 5 data) = 7. Modus = 7 (muncul 2 kali). Jadi mean = 6, median = 7, modus = 7.",
    miskonsepsi:
      "Siswa sering langsung mengambil nilai di posisi tengah untuk median tanpa mengurutkan data terlebih dahulu, padahal median hanya benar jika data sudah diurutkan dari kecil ke besar.",
  },
  {
    id: "statistika-penyebaran",
    topik: "Statistika",
    konsep: "Ukuran penyebaran (jangkauan, simpangan baku)",
    konten:
      "Ukuran penyebaran menunjukkan seberapa jauh data tersebar dari pusatnya. Jangkauan (range) = data terbesar - data terkecil, sedangkan simpangan baku adalah akar dari variansi, yaitu akar dari rata-rata kuadrat selisih setiap data terhadap rata-ratanya (untuk data populasi: s = akar((jumlah (x - rata-rata)^2) / n)).",
    contoh:
      "Data: 4, 5, 6, 7, 8. Jangkauan = 8 - 4 = 4. Rata-rata = (4+5+6+7+8)/5 = 6. Kuadrat selisih: (4-6)^2=4, (5-6)^2=1, (6-6)^2=0, (7-6)^2=1, (8-6)^2=4, jumlah = 10. Variansi = 10/5 = 2, maka simpangan baku = akar(2) sekitar 1,41.",
    miskonsepsi:
      "Siswa sering lupa mengakarkan variansi, sehingga menuliskan nilai variansi (2) sebagai jawaban simpangan baku, padahal simpangan baku = akar(2). Selain itu, banyak yang lupa mengkuadratkan selisih sehingga jumlah selisih menjadi 0.",
  },

  // Peluang
  {
    id: "kaidah-pencacahan",
    topik: "Peluang",
    konsep: "Kaidah pencacahan (permutasi & kombinasi)",
    konten:
      "Permutasi adalah banyak cara menyusun r objek dari n objek dengan urutan DIPERHATIKAN, rumusnya P(n,r) = n! / (n-r)!. Kombinasi adalah banyak cara memilih r objek dari n objek dengan urutan TIDAK diperhatikan, rumusnya C(n,r) = n! / (r! (n-r)!).",
    contoh:
      "Dari 5 siswa dipilih 1 ketua dan 1 wakil (urutan penting -> permutasi). P(5,2) = 5! / (5-2)! = 5!/3! = 5 x 4 = 20 cara. Jika hanya memilih 2 siswa sebagai perwakilan tanpa jabatan (urutan tak penting -> kombinasi): C(5,2) = 5! / (2! x 3!) = (5 x 4)/(2 x 1) = 10 cara.",
    miskonsepsi:
      'Siswa sering keliru menentukan kapan memakai permutasi dan kapan kombinasi; mereka cenderung menganggap semua "pemilihan" sebagai kombinasi, padahal jika ada jabatan/urutan yang membedakan (mis. ketua dan wakil) harus memakai permutasi.',
  },
  {
    id: "peluang",
    topik: "Peluang",
    konsep: "Peluang suatu kejadian",
    konten:
      "Peluang suatu kejadian A adalah perbandingan banyaknya hasil yang diinginkan dengan banyaknya seluruh hasil yang mungkin, ditulis P(A) = n(A)/n(S). Nilainya selalu antara 0 dan 1 (0 = mustahil, 1 = pasti terjadi).",
    contoh:
      "Sebuah dadu dilempar satu kali, cari peluang muncul mata dadu genap. Ruang sampel S = {1,2,3,4,5,6} sehingga n(S) = 6. Kejadian genap A = {2,4,6} sehingga n(A) = 3. Maka P(A) = n(A)/n(S) = 3/6 = 1/2.",
    miskonsepsi:
      "Siswa sering membalik rumus menjadi n(S)/n(A), sehingga hasilnya bisa lebih dari 1, padahal peluang tidak pernah melebihi 1.",
  },

  // Kalkulus
  {
    id: "limit",
    topik: "Kalkulus",
    konsep: "Limit fungsi aljabar",
    konten:
      "Limit fungsi aljabar adalah nilai yang didekati f(x) ketika x mendekati suatu bilangan a. Cara utamanya substitusi langsung x = a; jika hasilnya bentuk tak tentu 0/0, faktorkan pembilang dan penyebut lalu coret faktor yang sama sebelum disubstitusi ulang.",
    contoh:
      "Hitung lim x->2 (x^2 - 4)/(x - 2). Substitusi langsung: (2^2 - 4)/(2 - 2) = 0/0 (tak tentu). Faktorkan: (x - 2)(x + 2)/(x - 2), coret (x - 2) menjadi x + 2. Substitusi x = 2: 2 + 2 = 4. Jadi limitnya = 4.",
    miskonsepsi:
      "Siswa mengira jika substitusi menghasilkan 0/0 maka limitnya pasti 0 atau tidak ada, padahal 0/0 hanya bentuk tak tentu yang nilainya masih bisa dicari lewat pemfaktoran atau perkalian akar sekawan.",
  },
  {
    id: "turunan",
    topik: "Kalkulus",
    konsep: "Turunan (diferensial) dasar",
    konten:
      "Turunan mengukur laju perubahan (kemiringan garis singgung) suatu fungsi. Aturan inti (aturan pangkat): jika f(x) = x^n maka f'(x) = n*x^(n-1); turunan konstanta = 0, dan konstanta pengali tetap ikut dikali (turunan a*x^n = a*n*x^(n-1)).",
    contoh:
      "Tentukan turunan f(x) = 3x^2 + 5x - 4. Langkah per suku: turunan 3x^2 = 3*2*x^(2-1) = 6x; turunan 5x = 5*1*x^0 = 5; turunan -4 = 0. Hasil: f'(x) = 6x + 5.",
    miskonsepsi:
      "Siswa sering menganggap turunan suatu konstanta (misal -4) tetap -4, padahal turunan setiap konstanta selalu 0 sehingga suku itu hilang.",
  },

  // Matriks
  {
    id: "matriks",
    topik: "Matriks",
    konsep: "Operasi matriks dasar (penjumlahan & perkalian)",
    konten:
      "Penjumlahan matriks: dua matriks bisa dijumlahkan hanya jika ordonya (ukuran baris x kolom) sama, caranya menjumlahkan elemen yang seposisi. Perkalian matriks A (ordo m x n) dengan B (ordo n x p) menghasilkan matriks m x p, di mana setiap elemen = jumlah hasil kali elemen satu baris A dengan satu kolom B.",
    contoh:
      "Misal A = [[1, 2], [3, 4]] dan B = [[5, 6], [7, 8]]. Hasil A x B: baris 1 kolom 1 = (1)(5)+(2)(7) = 5+14 = 19; baris 1 kolom 2 = (1)(6)+(2)(8) = 6+16 = 22; baris 2 kolom 1 = (3)(5)+(4)(7) = 15+28 = 43; baris 2 kolom 2 = (3)(6)+(4)(8) = 18+32 = 50. Jadi A x B = [[19, 22], [43, 50]].",
    miskonsepsi:
      "Siswa sering mengira perkalian matriks dilakukan elemen seposisi (seperti penjumlahan), padahal harus baris x kolom; selain itu banyak yang menganggap A x B selalu sama dengan B x A, padahal perkalian matriks umumnya tidak komutatif.",
  },
];

const STOP = new Set([
  "yang", "dan", "di", "ke", "dari", "untuk", "pada", "itu", "ini", "cara",
  "gimana", "kak", "aku", "dong", "nih", "apa", "gitu", "sih", "ya", "kita",
  "kalau", "jadi", "biar", "sama", "atau", "juga", "aja",
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9²√∑\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

// Retrieval sederhana berbasis kata kunci + kecocokan topik.
// (Bisa di-upgrade ke embedding/vektor nanti; untuk korpus kecil ini sudah cukup.)
export function retrieve(query: string, topik: string, k = 3): Materi[] {
  const q = new Set(tokens(`${query} ${topik}`));
  const scored = kurikulum
    .map((m) => {
      const words = tokens(`${m.konsep} ${m.konten} ${m.topik} ${m.miskonsepsi ?? ""}`);
      let score = 0;
      for (const w of words) if (q.has(w)) score++;
      if (m.topik.toLowerCase() === topik.toLowerCase()) score += 3;
      return { m, score };
    })
    .sort((a, b) => b.score - a.score);

  const hits = scored.filter((s) => s.score > 0).slice(0, k).map((s) => s.m);
  if (hits.length > 0) return hits;

  // fallback: materi dengan topik sama, atau beberapa entri pertama
  const byTopik = kurikulum.filter(
    (m) => m.topik.toLowerCase() === topik.toLowerCase(),
  );
  return (byTopik.length ? byTopik : kurikulum).slice(0, k);
}
