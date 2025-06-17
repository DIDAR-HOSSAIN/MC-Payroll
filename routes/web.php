<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DonorMemberController;
use App\Http\Controllers\GeneralMemberController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AttendanceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Frontend Route

// Route::get('/', function () {
//     return Inertia::render('Home');
// })->name('home');

// Route::get('/mikrotik', function () {
//     return Inertia::render('Mikrotik/View');
// })->name('mikrotik');

// Route::get('/test-env', function () {
//     return env('MIKROTIK_HOST');
// });


// Route::resource('/mikrotik/interfaces', MikrotikController::class);
// Route::get('/check/env', [MikrotikController::class, 'checkEnv']);
// Route::post('/mikrotik/firewall', MikroTikController::class);

Route::resource('general/members', GeneralMemberController::class);

Route::resource('donors', DonorMemberController::class);

// Route::resource('attendance', AttendanceController::class);

Route::get('/attendance/sync', [AttendanceController::class, 'sync']);
Route::get('/attendance/report/{employee_id}', [AttendanceController::class, 'report']);





// Route::inertia('/', 'Home')->name('home');

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::resource('users', UserController::class);
Route::get('product-view/{id}', [ProductController::class, 'getProducts'])->name('product-view');
Route::resource('orders', OrderController::class);
Route::get('order/invoice/{order_id}', [OrderController::class, 'getInvoice'])->name('order.invoice');
Route::get('/thanks/{orderId}', [OrderController::class, 'thanks'])->name('thanks');

//Super admin route
Route::middleware(['auth', 'check_user_status', 'check_roles:super-admin'])->group(function () {
    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('products', ProductController::class);
    Route::put('/users/{id}/toggle-active', [UserController::class, 'toggleActiveInactiveUser'])->name('users.toggleActive');
    Route::resource('sliders', SliderController::class);
    Route::resource('categories', CategoryController::class);
});




Route::inertia('/whoweare', 'WhoWeAre')->name('whoweare');

Route::inertia('/about', 'About')->name('about');

Route::inertia('/gallery', 'Gallery')->name('gallery');

Route::inertia('/general/members', 'Member')->name('members');

Route::inertia('/events', 'Event')->name('events');

Route::inertia('/notice', 'NoticeBoard')->name('notice');


Route::get('registers', [RegisteredUserController::class, 'index'])->middleware(['auth', 'verified'])->name('registers');

Route::get('register', [RegisteredUserController::class, 'create'])->middleware(['auth', 'verified'])->name('register');

Route::post('register', [RegisteredUserController::class, 'store'])->middleware(['auth', 'verified']);


Route::get('contacts/create', [ContactController::class, 'create'])->name('contacts.create');
Route::resource('contacts', ContactController::class)->middleware(['auth', 'verified'])->except('create');

Route::middleware(['auth'])->group(function () {});

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
