// Rumus kunci per topik, hasil ekstraksi VERBATIM dari "konten" tiap materi + verifikasi
// adversarial akurasi matematis (via workflow). Digabung oleh materiById() untuk topik yang
// belum punya rumus inline. 4 topik (eksponen-logaritma, barisan-deret, fungsi-kuadrat,
// perbandingan-trigonometri) sudah punya rumus inline di materi.ts → tidak diulang di sini.
// Topik konseptual/prosedural tanpa rumus alami (spltv, sptldv, mengenal bilangan, membaca
// waktu/data, dll) sengaja TIDAK dimasukkan (tak dipaksakan).
export const rumusExtra: Record<string, string[]> = {
  "statistika-data-kelompok": [
    "Titik tengah: xi = (batas bawah + batas atas)/2",
    "Rata-rata: x-bar = jumlah(fi × xi) / jumlah(fi)",
    "Median: Me = Tb + p × ((n/2 - F) / f)",
    "Modus: Mo = Tb + p × (d1 / (d1 + d2))",
  ],
  "peluang": [
    "Saling lepas: P(A atau B) = P(A) + P(B)",
    "Aturan penjumlahan umum: P(A atau B) = P(A) + P(B) - P(A dan B)",
    "Saling bebas: P(A dan B) = P(A) × P(B)",
  ],
  "sma-f-lingkaran": [
    "Persamaan baku: (x - a)^2 + (y - b)^2 = r^2",
    "Bentuk umum: x^2 + y^2 + Ax + By + C = 0",
    "Pusat (-A/2, -B/2), r = akar((A/2)^2 + (B/2)^2 - C)",
    "Garis singgung di (x1, y1): x1·x + y1·y + A(x + x1)/2 + B(y + y1)/2 + C = 0",
  ],
  "sma-f-komposisi-invers": [
    "(f o g)(x) = f(g(x))",
    "f^(-1)(f(x)) = x",
    "f(f^(-1)(y)) = y",
  ],
  "sma-f-transformasi-matriks": [
    "(x' ; y') = M × (x ; y), dengan x' = a·x + b·y dan y' = c·x + d·y",
    "Rotasi pusat O sudut a: [cos a  -sin a ; sin a  cos a]",
    "Dilatasi pusat O faktor k: [k 0 ; 0 k]",
    "Translasi: (x' ; y') = (x ; y) + (p ; q)",
  ],
  "sma-f-statistika-lanjut": [
    "Regresi linear: y = a + bx",
    "b = (n × Sxy - Sx × Sy) / (n × Sx2 - (Sx)^2)",
    "a = y_rata - b × x_rata",
  ],
  "sma-f-peluang-bersyarat": [
    "P(A|B) = P(A irisan B) / P(B), dengan P(B) ≠ 0",
  ],
  "sma-f-keuangan": [
    "Bunga majemuk: M = M0 × (1 + i)^n",
    "Anuitas: A = (M0 × i) / (1 - (1 + i)^(-n))",
  ],
  "sma-fl-polinomial": [
    "P(x) = a_n·x^n + a_(n-1)·x^(n-1) + ... + a_1·x + a_0",
    "Teorema Sisa: sisa P(x) : (x - k) = P(k)",
    "Teorema Faktor: P(k) = 0 → (x - k) faktor P(x)",
  ],
  "sma-fl-matriks-vektor": [
    "Syarat kali A × B: kolom A = baris B",
    "Ordo hasil: A(m×n) × B(n×p) → C(m×p)",
  ],
  "sma-fl-fungsi-trig": [
    "sin x = sin a → x = a + k·360 atau x = (180 - a) + k·360",
    "cos x = cos a → x = a + k·360 atau x = -a + k·360",
    "tan x = tan a → x = a + k·180",
    "sin^2 x + cos^2 x = 1",
  ],
  "sma-fl-limit": [
    "lim x->0 (sin x)/x = 1",
    "lim x->0 (tan x)/x = 1",
    "lim x->0 (sin ax)/(bx) = a/b",
  ],
  "sma-fl-kalkulus": [
    "f(x) = a·x^n → f'(x) = a·n·x^(n-1)",
    "turunan konstanta = 0",
    "integral a·x^n dx = a·x^(n+1)/(n+1) + C, n ≠ -1",
  ],
  "sma-fl-geometri-ruang": [
    "Diagonal sisi kubus: rusuk × akar(2)",
    "Diagonal ruang kubus: rusuk × akar(3)",
  ],
  "smp-d-bilangan": [
    "a^m × a^n = a^(m+n)",
    "a^m / a^n = a^(m-n)",
    "a^(-n) = 1/a^n",
    "akar(a) × akar(b) = akar(a×b)",
  ],
  "smp-d-aljabar": [
    "Fungsi linear: y = mx + c",
  ],
  "smp-d-geometri": [
    "Teorema Pythagoras: a^2 + b^2 = c^2 (c sisi miring)",
  ],
  "smp-d-pengukuran": [
    "Prisma tegak & tabung: V = luas alas × tinggi",
    "Limas & kerucut: V = 1/3 × luas alas × tinggi",
    "Balok: V = p × l × t",
    "Tabung: V = π × r^2 × t",
  ],
  "smp-d-data-peluang": [
    "Mean = jumlah semua data / banyak data",
    "Jangkauan = data terbesar - data terkecil",
    "Peluang: P(A) = n(A) / n(S)",
  ],
  "sd-a-waktu": [
    "Menit = angka jarum panjang × 5",
  ],
  "sd-b-kali-bagi": [
    "Sifat komutatif perkalian: a × b = b × a",
    "Keluarga fakta: dari a × b = c maka c : a = b dan c : b = a",
  ],
  "sd-b-pecahan-senilai": [
    "Pecahan senilai: a/b = (a × k)/(b × k), dengan k bukan 0",
    "Menyederhanakan: a/b = (a : k)/(b : k)",
  ],
  "sd-b-uang": [
    "Jumlah uang = nilai tiap jenis × banyak (lembar/keping), lalu dijumlahkan",
    "Kembalian = uang dibayar - harga",
  ],
  "sd-b-ukur-baku": [
    "Turun 1 anak tangga: nilai × 10; Naik 1 anak tangga: nilai : 10",
    "1 km = 1000 m; 1 m = 100 cm; 1 cm = 10 mm",
    "1 kg = 1000 g",
  ],
  "sd-b-luas-keliling": [
    "Persegi panjang - Keliling = 2 × (panjang + lebar)",
    "Persegi panjang - Luas = panjang × lebar",
    "Persegi - Keliling = 4 × sisi",
    "Persegi - Luas = sisi × sisi",
  ],
  "sd-b-piktogram": [
    "Banyak data = banyak gambar × nilai kunci",
    "Setengah gambar = setengah dari nilai kunci",
  ],
  "sd-c-desimal-persen": [
    "Persen ke desimal: persen / 100",
    "Desimal ke persen: desimal × 100",
    "a% dari b: a/100 × b",
  ],
  "sd-c-pangkat-akar": [
    "a^2 = a × a",
    "a^3 = a × a × a",
    "akar(a) = b berarti b × b = a",
    "akar3(a) = b berarti b × b × b = a",
  ],
  "sd-c-rasio-skala": [
    "Jarak sebenarnya = jarak pada peta × angka skala",
    "Jarak pada peta = jarak sebenarnya / angka skala",
  ],
  "sd-c-jaring": [
    "Luas persegi: sisi × sisi",
    "Luas jaring-jaring kubus: 6 × sisi × sisi",
  ],
  "sd-c-mmm": [
    "Frekuensi = banyaknya turus (1 kelompok = 4 garis tegak + 1 garis miring = 5)",
    "Nilai pada piktogram = banyak gambar x nilai kunci",
    "Skala peluang (kecil ke besar): tidak mungkin, kurang mungkin, mungkin, sangat mungkin, pasti",
  ],
};
