package org.example.proyecto3_tecnica.config;

import lombok.RequiredArgsConstructor;
import org.example.proyecto3_tecnica.security.JwtAuthFilter;
import org.example.proyecto3_tecnica.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private static final String SUPER_ADMIN = "SUPER-ADMIN-ROLE";
    private static final String USER = "USER";

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/registro").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/categorias", "/api/categorias/**",
                                "/api/productos", "/api/productos/**"
                        ).hasAnyAuthority(SUPER_ADMIN, USER)
                        .requestMatchers(HttpMethod.POST,
                                "/api/categorias", "/api/categorias/**",
                                "/api/productos", "/api/productos/**"
                        ).hasAuthority(SUPER_ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/categorias/**", "/api/productos/**").hasAuthority(SUPER_ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/categorias/**", "/api/productos/**").hasAuthority(SUPER_ADMIN)
                        .requestMatchers(HttpMethod.GET, "/api/usuarios", "/api/usuarios/**").hasAuthority(SUPER_ADMIN)
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
