<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withHeader('Origin', 'http://localhost:3000');
    }

    #[Test]
    public function 正しい入力内容で会員登録できる(): void
    {
        $response = $this->postJson('/api/register', $this->validData());

        $response
            ->assertCreated()
            ->assertJsonPath('message', '会員登録が完了しました')
            ->assertJsonPath('user.name', 'テストユーザー')
            ->assertJsonPath('user.email', 'test@example.com');

        $this->assertDatabaseHas('users', [
            'name' => 'テストユーザー',
            'email' => 'test@example.com',
        ]);

        $user = User::where('email', 'test@example.com')->firstOrFail();

        $this->assertAuthenticatedAs($user);
    }

    #[Test]
    public function 必須項目が未入力の場合は登録できない(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => '',
            'email' => '',
            'password' => '',
            'password_confirmation' => '',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'password']);

        $this->assertDatabaseCount('users', 0);
    }

    #[Test]
    public function 重複したメールアドレスでは登録できない(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $response = $this->postJson('/api/register', $this->validData());

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email'])
            ->assertJsonPath(
                'errors.email.0',
                'このメールアドレスはすでに登録されています'
            );

        $this->assertDatabaseCount('users', 1);
    }

    #[Test]
    public function パスワードが八文字未満の場合は登録できない(): void
    {
        $data = $this->validData();
        $data['password'] = 'pass123';
        $data['password_confirmation'] = 'pass123';

        $response = $this->postJson('/api/register', $data);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['password'])
            ->assertJsonPath(
                'errors.password.0',
                'パスワードは8文字以上で入力してください'
            );

        $this->assertDatabaseCount('users', 0);
    }

    /**
     * 正常な会員登録データを返す
     *
     * @return array<string, string>
     */
    private function validData(): array
    {
        return [
            'name' => 'テストユーザー',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];
    }
}
